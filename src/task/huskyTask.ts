import enquirer from "enquirer";
import spinner from "../utils/ora";
import log from "../utils/log";
import execa from "execa";
import dirHelper from "../utils/dir";
import fs from "fs-extra";
import fileHelper from "../utils/file";
import path from "path";
import { IPromptThenable } from "./types";

const initHuskyConfig = async (hasInstallHusky: boolean = false) => {
  spinner.start("正在生成 husky 配置文件...");

  const {
    data: templatePath,
    reason,
    status,
  } = await dirHelper.getTemplatePath();

  if (!status) {
    log.error(reason as string, "initHuskyConfig");
    return;
  }
  const packageRoot = await dirHelper.getProjectRoot();

  // 生成 husky 配置文件
  const packageHuskyPath = path.join(packageRoot, "/.husky/");

  const huskyTplPath = path.join(templatePath, "/husky_tpl/");

  // has install husky
  if (hasInstallHusky) {
    // The pre-commit file is configured by default
    try {
      // if .husky folder does not exist
      if (!fs.existsSync(packageHuskyPath)) {
        spinner.stop();
        log.error(
          "检测到项目中没有.husky文件夹，建议卸载husky后重新执行forbid-lint init指令"
        );
        process.exit(0);
      }

      // else if pre-commit file does not exist
      const packagePreCommitPath = path.join(packageHuskyPath, "pre-commit");

      if (!fileHelper.isFileExit(packagePreCommitPath)) {
        console.log();
        log.warn(
          "检测到项目中husky没有配置pre-commit文件，将自动创建",
          "initHuskyConfig"
        );
        fs.writeFileSync(packagePreCommitPath, "npx forbid-lint check");
        spinner.succeed(log.chalk.green.bold("创建pre-commit文件成功"));
        return;
      }

      // else if pre-commit file exists & has been configured forbid lint script
      const preCommitStr = fs.readFileSync(packagePreCommitPath, "utf-8");
      if (preCommitStr.includes("npx forbid-lint check")) {
        spinner.succeed(
          log.chalk.green(
            "husky pre-commit frobid-lint has been configured，continue..."
          )
        );
        return;
      }

      // else
      fs.writeFileSync(
        path.join(packageHuskyPath, "pre-commit"),
        preCommitStr + "\n" + "npx forbid-lint check"
      );
      spinner.succeed(log.chalk.green.bold("husky 配置文件生成完成"));
    } catch (e) {
      log.error(JSON.stringify(e), "initHuskyConfig");
      spinner.fail(
        log.chalk.red.bold("husky 配置文件生成失败，请手动创建 husky 配置文件")
      );
    }
  } else {
    try {
      fs.removeSync(packageHuskyPath);

      const huskyTplMap = await fileHelper.getFileMapByPath(huskyTplPath);

      huskyTplMap.forEach(async (name) => {
        const filePath = path.join(packageRoot, name);
        fs.ensureDirSync(path.dirname(filePath));
        /* eslint-disable @typescript-eslint/no-explicit-any */
        fs.writeFileSync(filePath, (huskyTplMap as any)[name] || "");

        // 增加每个文件的可执行权限
        await execa("chmod", ["+x", filePath]);
      });

      spinner.succeed(log.chalk.green.bold("husky 配置文件生成完成"));
    } catch (e) {
      log.error(JSON.stringify(e), "ensurePathFile");
      spinner.fail(
        log.chalk.red.bold("husky 配置文件生成失败，请手动创建 husky 配置文件")
      );
    }
  }

  // 补充package.json 中的 husky 配置
  if (!hasInstallHusky) {
    spinner.start("正在补充 package.json 中的 husky 配置...");
    try {
      const packageJsonPath = path.join(packageRoot, "/package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      packageJson.scripts.prepare =
        "(husky install 2>/dev/null ||:) && mkdir -p .husky";
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      spinner.succeed(
        log.chalk.green.bold("补充 package.json 中的 husky 配置完成")
      );
    } catch (e) {
      spinner.fail(
        log.chalk.red.bold("补充 package.json 中的 husky 配置失败，请手动补充")
      );
    }
  }
};

const huskyPrompt = () => {
  return enquirer
    .prompt([
      {
        type: "confirm",
        name: "installHusky",
        message: log.chalk.blue.bold("检测到项目未安装husky，是否安装 husky?"),
        initial: true,
      },
    ])
    .then((async ({ installHusky }) => {
      if (installHusky) {
        try {
          spinner.start("正在安装 husky...");

          const packageManager = await dirHelper.getPkgManage();
          const result = execa.sync(
            packageManager,
            ["install", "-D", "husky@9.1.7"],
            {
              cwd: process.cwd(),
            }
          );
          if (result.exitCode === 0) {
            spinner.succeed(log.chalk.green.bold("husky安装成功"));
            await initHuskyConfig();
          }
        } catch (error: Error | unknown) {
          spinner.fail(log.chalk.red.bold("husky安装失败"));
          log.error(
            JSON.stringify((error as Error)?.message ?? ""),
            "husky安装失败"
          );
        }
      }
    }) as IPromptThenable)
    .catch(() => log.done("退出进程，结束初始化，欢迎再次使用", "exit"));
};

const huskyTask = {
  initHuskyConfig,
  huskyPrompt,
};

export default huskyTask;
