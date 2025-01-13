import path from "path";
import fs from "fs-extra";
import log from "./log";
import helper from "./helper";

const isFileExit = (path: string) => {
  if (!path) return false;
  return fs.existsSync(path);
};

const ensureDir = (
  path: string,
  cb?: () => void
): ReturnType<typeof helper.resultPromiseWrap> => {
  return helper.resultPromiseWrap((resolve) => {
    if (!path) {
      log.error(`path 参数：${path} 非法`, "ensureDir");
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
      log.error(JSON.stringify(error), "ensureDir");
      resolve({
        reason: JSON.stringify(error),
        status: false,
      });
    }
  });
};

const fileHelper = {
  isFileExit,
  ensureDir,
};

export default fileHelper;
