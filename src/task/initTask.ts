import dirHelper from "../utils/dir";
import enquirer from "enquirer";
import ora from "ora";

interface IInitTaskOptions {
  force: boolean;
}

const huskyPrompt = () => {
  enquirer
    .prompt([
      {
        type: "confirm",
        name: "installHusky",
        message: "是否安装 husky?",
        initial: true,
      },
    ])
    .then((installHusky) => {
      console.log(installHusky);
    });
};

export const initTask = async ({ force: Boolean }: IInitTaskOptions) => {
  const isInstallHusky = await dirHelper.getModuleIsInstalled("husky");
  if (!isInstallHusky) {
    huskyPrompt();
  }
};
