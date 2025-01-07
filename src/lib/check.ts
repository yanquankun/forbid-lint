import { execSync } from "child_process";

export default function () {
  try {
    // 获取本次提交的文件
    const stagedFiles = execSync("git status --porcelain | awk '{print $2}'", {
      encoding: "utf-8",
    })
      .split("\n")
      .filter(Boolean);

    // 需要检查的文件类型
    const eslintFiles = [
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

    // 判断是否包含非法修改
    console.log("stagedFiles", stagedFiles);
    const hasEslintChanges = stagedFiles.some((file) =>
      eslintFiles.includes(file)
    );

    if (hasEslintChanges) {
      console.error("❌ 禁止提交：ESLint 配置文件被修改！");
      process.exit(1); // 阻止提交
    }

    console.log("✅ 检查通过，可以提交。");
  } catch (error) {
    console.error("❌ 检查过程出错：", error);
    process.exit(1); // 阻止提交
  }
}
