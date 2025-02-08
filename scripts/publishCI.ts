import { publish } from "./publish";
import path from "path";

// Check the tag passed in CI, and skip provenance if tag has `@` due to
// https://github.com/slsa-framework/slsa-github-generator/pull/2758 not released
const tag = process.argv.slice(2)[0] ?? "";
const provenance = !tag.includes("@");

publish({
  defaultPackage: "@vexjs/forbid-lint",
  getPkgDir: () => path.resolve(__dirname, "../"),
  provenance,
  packageManager: "pnpm",
});
