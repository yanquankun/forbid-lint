import path from "path";
import fs from "fs-extra";
import log from "./log";
import helper from "./helper";

const isFileExit = (path: string) => {
  if (!path) return false;
  return fs.existsSync(path);
};

const ensurePathFile = (
  path: string,
  cb?: () => void
): ReturnType<typeof helper.withResultWarp> => {
  return helper.withResultWarp((resolve) => {
    if (!path) {
      log.error(`path 参数：${path} 非法`, "ensurePathFile");
      resolve({ reason: `path 参数：${path} 非法`, status: false });
    }

    try {
      fs.ensureDirSync(path);
      typeof cb === "function" && cb();
      resolve({
        reason: null,
        status: true,
      });
    } catch (error) {
      log.error(JSON.stringify(error), "ensurePathFile");
      resolve({
        reason: JSON.stringify(error),
        status: false,
      });
    }
  });
};

const fileHelper = {
  isFileExit,
  ensurePathFile,
};

export default fileHelper;
