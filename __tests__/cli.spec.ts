import fs from "node:fs";
import path from "node:path";
import type { SyncOptions, ExecaSyncReturnValue } from "execa";
import execa, { commandSync } from "execa";

const DEMO_PATH = path.resolve(__dirname, "../demo");
const demoPkg = JSON.parse(
  fs.readFileSync(path.resolve(DEMO_PATH, "package.json"), "utf-8")
);
const cliPkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf-8")
);
const version = cliPkg.version || "0.0.0";
const installHuskyVersion = "9.1.7";

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

const initDemo = async () => {
  await execa("sh", ["-c", "yes | npx forbid-lint init"], {
    stdio: "ignore",
    cwd: DEMO_PATH,
  });
};

beforeAll(() => {
  resetDemoProject();
  initDemo();
});

//====== base test case ======
describe("base test case", () => {
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
});
//====== base test case ======

//====== function test case ======
const isHasPreCommitFile = fs.existsSync(
  path.resolve(DEMO_PATH, ".husky/pre-commit")
);

const preCommitFileContent = fs.readFileSync(
  path.resolve(DEMO_PATH, ".husky/pre-commit"),
  "utf-8"
);

const forbidRcFileContent = JSON.parse(
  fs.readFileSync(path.resolve(DEMO_PATH, ".forbidrc.json"), "utf-8")
);

describe("function test case", () => {
  test("run forbid-lint init shell should install husky", () => {
    expect(demoPkg.devDependencies.husky).toBeTruthy();
  });

  test("run forbid-lint init shell should auto gen .husky folder", () => {
    const isHasHuskyFolder = fs.existsSync(path.resolve(DEMO_PATH, ".husky"));

    expect(isHasHuskyFolder).toBeTruthy();
  });

  test.each([
    isHasPreCommitFile,
    preCommitFileContent.includes("npx forbid-lint check"),
  ])(
    ".husky folder should auto gen pre-commit file and write content npx forbid-lint check",
    (output) => {
      expect(output).toBeTruthy();
    }
  );

  test("run forbid-lint init shell should auto gen .forbidrc.json file", () => {
    const isHasForbidRcFile = fs.existsSync(
      path.resolve(DEMO_PATH, ".forbidrc.json")
    );

    expect(isHasForbidRcFile).toBeTruthy();
  });

  test('.forbidrc.json file should has lintFiles field and value is [".eslintrc.js", ".eslintrc.json", ".eslintrc.yml"]', () => {
    const bol =
      forbidRcFileContent.lintFiles &&
      forbidRcFileContent.lintFiles.includes(
        ".eslintrc.js",
        ".eslintrc.json",
        ".eslintrc.yml"
      );

    expect(bol).toBeTruthy();
  });

  test(`cli install husky version should be ${installHuskyVersion}`, () => {
    expect(demoPkg.devDependencies["husky"]).toEqual(installHuskyVersion);
  });

  test.todo(
    "forbid-lint check test case should be write，but the cli check now only suport project root catalog! when solve this problem, need write this case"
  );
});
//====== function test case ======
