import { publish } from "./publish";
import path from "path";

publish({
  defaultPackage: "@vexjs/forbid-lint",
  getPkgDir: () => path.resolve(__dirname, "../"),
  // remove security check
  provenance: false,
  packageManager: "pnpm",
});
