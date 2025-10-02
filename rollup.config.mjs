import cleanup from "rollup-plugin-cleanup";
import filesize from "rollup-plugin-filesize";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import path from "node:path";
import fs from "node:fs";

const isProduction = process.env.NODE_ENV === "production";
const targetPackage = process.argv.includes("--config-package")
  ? process.argv[process.argv.indexOf("--config-package") + 1]
  : null;

const packagesDir = path.resolve(__dirname, "packages");
const packages = fs.readdirSync(packagesDir).filter((pkg) => {
  const pkgPath = path.join(packagesDir, pkg);
  const stat = fs.statSync(pkgPath);
  if (!stat.isDirectory()) return false;
  const pkgJsonPath = path.join(pkgPath, "package.json");
  return (
    fs.existsSync(pkgJsonPath) &&
    (targetPackage === null || pkg === targetPackage)
  );
});

export default packages.map((pkg) => {
  const pkgPath = path.join(packagesDir, pkg);
  const pkgJson = JSON.parse(
    fs.readFileSync(path.join(pkgPath, "package.json"), "utf-8")
  );

  return defineConfig({
    input: path.join(pkgPath, "src", "index.js"),
    output: [
      {
        file: path.join(
          pkgPath,
          pkgJson.module || path.join("dist", "index.mjs")
        ),
        format: "esm",
        sourcemap: true,
      },
      {
        file: path.join(pkgPath, pkgJson.main || path.join("dist", "index.js")),
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      cleanup(),
      nodeResolve({
        preferBuiltins: true,
        modulePaths: [packagesDir],
      }),
      commonjs(),
      filesize(),
      isProduction &&
        terser({
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          mangle: true,
          format: {
            comments: false,
          },
        }),
    ].filter(Boolean),
    external: [
      ...Object.keys(pkgJson.dependencies || {}),
      ...Object.keys(pkgJson.peerDependencies || {}),
    ],
  });
});
