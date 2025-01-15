import { execSync } from "child_process";
import fileHelper from "../utils/file";
import dirHelper from "../utils/dir";
import path from "path";
import fs from "fs-extra";
import log from "../utils/log";
import spinner from "../utils/ora";
import { json } from "stream/consumers";

// 需要检查的文件类型
let forbidFiles = [
  ".eslintrc.js",
  ".eslintrc.cjs",
  ".eslintrc.yaml",
  ".eslintrc.yml",
  ".eslintrc.json",
  "eslint.config.js",
  "eslint.config.mjs",
  "eslint.config.cjs",
  "eslint.config.ts",
  "eslint.config.mts",
  "eslint.config.cts",
];

export default async function () {
  try {
    spinner.start("检查是否包含禁止修改的文件...");

    // 获取本次提交的文件
    const stagedFiles = execSync("git status --porcelain | awk '{print $2}'", {
      encoding: "utf-8",
    })
      .split("\n")
      .filter(Boolean);

    const packageRoot = await dirHelper.getProjectRoot();
    const forbidrcPath = path.join(packageRoot, "/.forbidrc.json");

    if (fileHelper.isFileExit(forbidrcPath)) {
      const { lintFiles } = JSON.parse(fs.readFileSync(forbidrcPath, "utf-8"));
      forbidFiles = lintFiles;
    }

    const cantCommitFiles = stagedFiles
      .map((file) =>
        forbidFiles.filter((forbidFile) => file.endsWith(forbidFile))
      )
      .flat();

    if (cantCommitFiles?.length) {
      spinner.fail(
        log.chalk.red.bold(
          `禁止提交：\n${cantCommitFiles.join("\n")}\n 配置文件被修改，请检查!`
        )
      );
      process.exit(1);
    }

    spinner.succeed("检查通过，可以提交");
  } catch (error) {
    spinner.fail(`检查过程出错：${JSON.stringify(error)}`);
  } finally {
    spinner.stop();
  }
}
