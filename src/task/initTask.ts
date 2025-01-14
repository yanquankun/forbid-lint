import dirHelper from "../utils/dir";
import enquirer from "enquirer";
import spinner from "../utils/ora";
import log from "../utils/log";
import execa from "execa";

interface IInitTaskOptions {
  force: boolean;
}

interface IPromptThenable {
  (value: unknown): void | PromiseLike<void>;
}

const huskyPrompt = () => {
  enquirer
    .prompt([
      {
        type: "confirm",
        name: "installHusky",
        message: "检测到项目未安装husky，是否安装 husky?",
        initial: true,
      },
    ])
    .then((async ({ installHusky }) => {
      if (installHusky) {
        try {
          spinner.start("正在安装 husky...");

          const packageManager = await dirHelper.getPkgManage();
          // TODO: 包管理方式修改
          const result = execa.sync(
            packageManager,
            ["install", "-D", "husky"],
            {
              cwd: process.cwd(),
            }
          );
          if (result.exitCode === 0) {
            spinner.succeed(log.chalk.green.bold("husky安装成功"));
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

export const initTask = async ({ force = false }: IInitTaskOptions) => {
  // 校验husky
  spinner.start("正在检测项目是否安装 husky...");
  const isInstallHusky = await dirHelper.getModuleIsInstalled("husky");
  spinner.stop();
  if (!isInstallHusky) {
    huskyPrompt();
  }
};
