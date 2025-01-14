import spinner from "../utils/ora";

const initForbidrcJson = () => {
  spinner.start("正在检测项目是否配置 .forbidrc.json文件...");
};

export default initForbidrcJson;
