import fs from "node:fs";
import path from "node:path";
import type { SyncOptions, ExecaSyncReturnValue } from "execa";
import { commandSync } from "execa";

const DEMO_PATH = path.resolve(__dirname, "../demo");
const version = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../", "package.json"), "utf-8")
).version;

const run = (args: string[], options?: SyncOptions): ExecaSyncReturnValue => {
  return commandSync(`${args.join(" ")}`, {
    ...options,
    cwd: DEMO_PATH,
  });
};

/** reset demo project to
 *   1. uninstall husky
 *   2. remove .husky folder
 *   3. remove .forbidrc.json file
 */
const resetDemoProject = () => {
  if (fs.existsSync(DEMO_PATH)) {
    try {
      run(["pnpm", "uninstall", "husky"], {
        // prevent when exec this cmd, but husky not installed , the progress cant be continue
        reject: false,
      });

      run(["rm", "-rf", ".husky"]);

      run(["rm", "-rf", ".forbidrc.json"]);
    } catch (error) {
      // ignore error
    }
  }
};

beforeAll(() => {
  resetDemoProject();
});

test("run forbid-lint --version should equal package version", () => {
  const { stdout } = run(["npx forbid-lint", "--version"]);
  expect(stdout).toBe(version);
});

test("run forbid-lint --help should show help message", () => {
  const { stdout } = run(["npx forbid-lint", "--help"]);
  expect(stdout).toContain("Usage: forbid-lint [options] [command]");
});

test("run forbid-lint init --help should show init help message", () => {
  const { stdout } = run(["npx forbid-lint", "init", "--help"]);
  expect(stdout).toContain("Usage: forbid-lint init [options]");
});

test("run forbid-lint init --help should show init help message with -h alisa", () => {
  const { stdout } = run(["npx forbid-lint", "init", "-h"]);
  expect(stdout).toContain("Usage: forbid-lint init [options]");
});

test("run forbid-lint check --help should show check help message", () => {
  const { stdout } = run(["npx forbid-lint", "check", "--help"]);
  expect(stdout).toContain("Usage: forbid-lint check [options]");
});

test("run forbid-lint check --help should show check help message with -h alisa", () => {
  const { stdout } = run(["npx forbid-lint", "check", "-h"]);
  expect(stdout).toContain("Usage: forbid-lint check [options]");
});