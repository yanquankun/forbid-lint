import dirHelper from "../utils/dir";
import spinner from "../utils/ora";
import huskyTask from "./huskyTask";
import initForbidrcJson from "./forbidrcTask";

interface IInitTaskOptions {
  force: boolean;
}

export const initTask = async ({ force = false }: IInitTaskOptions) => {
  // 校验husky
  spinner.start("正在检测项目是否安装 husky...");
  const isInstallHusky = await dirHelper.getModuleIsInstalled("husky");
  spinner.stop();
  if (!isInstallHusky) {
    await huskyTask.huskyPrompt();
  } else {
    await huskyTask.initHuskyConfig(true);
  }

  // 校验.frobidrc.json
  initForbidrcJson();
};
