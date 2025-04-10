import copy from "rollup-plugin-copy";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "esm",
    },
  ],
  plugins: [
    copy({
      targets: [{ src: "src/index.html", dest: "dist" }],
    }),
    nodeResolve({ modulesOnly: true }),
  ],
};
