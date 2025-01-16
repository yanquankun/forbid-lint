import spinner from "@utils/ora";
import dirHelper from "@utils/dir";
import path from "path";
import log from "@utils/log";
import fileHelper from "@utils/file";
import enquirer from "enquirer";
import { IPromptThenable } from "./types";
import fs from "fs-extra";

const createForbidrcJson = async () => {
  spinner.start("正在生成.forbidrc.json文件...");
  const packageRoot = await dirHelper.getProjectRoot();
  const {
    data: templatePath,
    reason,
    status,
  } = await dirHelper.getTemplatePath();

  if (!status) {
    log.error(reason as string, "createForbidrcJson");
    spinner.stop();
    return;
  }

  const forbidrcPath = path.join(templatePath, "/.forbidrc.json");
  const forbidrcStr = fs.readFileSync(forbidrcPath, "utf8");
  const forbidrcDir = path.join(packageRoot, "/.forbidrc.json");

  fs.writeFileSync(forbidrcDir, forbidrcStr);
  spinner.succeed(log.chalk.green.bold("初始化.forbidrc.json文件成功"));
};

const forbidrcTaskPrompt = () => {
  enquirer
    .prompt([
      {
        type: "confirm",
        name: "configurationForbidrc",
        message: log.chalk.blue.bold(
          "检测到根目录未配置.forbidrc.json文件，是否配置?如不配置，将以默认配置进行校验"
        ),
        initial: true,
      },
    ])
    .then((async ({ configurationForbidrc }) => {
      if (configurationForbidrc) {
        createForbidrcJson();
      } else {
        log.done("初始化结束，欢迎再次使用", "over");
      }
    }) as IPromptThenable)
    .catch(() => log.done("退出进程，结束初始化，欢迎再次使用", "exit"));
};

const initForbidrcJson = async () => {
  spinner.start("正在检测项目是否配置 .forbidrc.json文件...");
  const packagePath = await dirHelper.getProjectRoot();
  const forbidrcPath = path.join(packagePath, "/.forbidrc.json");

  if (fileHelper.isFileExit(forbidrcPath)) {
    spinner.succeed(log.chalk.green("已配置.forbidrc.json"));
    spinner.succeed(log.chalk.green("初始化完成，欢迎再次使用", "exit"));
    spinner.stop();
  } else {
    spinner.stop();
    forbidrcTaskPrompt();
  }
};

export default initForbidrcJson;
