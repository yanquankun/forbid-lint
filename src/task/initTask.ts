import dirHelper from "../utils/dir";
import enquirer from "enquirer";
import spinner from "../utils/ora";
import log from "../utils/log";

interface IInitTaskOptions {
  force: boolean;
}

const huskyPrompt = () => {
  spinner.stop();
  enquirer
    .prompt([
      {
        type: "confirm",
        name: "installHusky",
        message: "检测到项目未安装husky，是否安装 husky?",
        initial: true,
      },
    ])
    .then((installHusky) => {
      console.log(installHusky);
    })
    .catch((e) => log.done("退出进程，结束初始化，欢迎再次使用", "exit"));
};

export const initTask = async ({ force = false }: IInitTaskOptions) => {
  spinner.start("正在检测项目是否安装 husky...");
  const isInstallHusky = await dirHelper.getModuleIsInstalled("husky");
  if (!isInstallHusky) {
    huskyPrompt();
  }
};
