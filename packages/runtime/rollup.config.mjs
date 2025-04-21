import cleanup from "rollup-plugin-cleanup";
import filesize from "rollup-plugin-filesize";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  plugins: [nodeResolve(), terser(), cleanup()],
  output: [
    {
      file: "dist/fwork.js",
      format: "esm",
      plugins: [filesize()],
    },
  ],
};
