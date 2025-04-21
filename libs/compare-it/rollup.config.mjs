import cleanup from "rollup-plugin-cleanup";
import filesize from "rollup-plugin-filesize";
import terser from "@rollup/plugin-terser";

export default {
  input: "index.js",
  plugins: [cleanup(), terser()],
  output: [
    {
      file: "dist/index.js",
      format: "esm",
      plugins: [filesize()],
    },
  ],
};
