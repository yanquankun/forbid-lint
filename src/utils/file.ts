import path from "path";
import fs from "fs-extra";
import log from "./log";
import helper from "./helper";
import globby from "globby";
import ejs from "ejs";
import { Options as ejsOptions } from "ejs";
import { fi } from "element-plus/es/locales.mjs";

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

const getFileMapByPath = async (
  dirPath: string,
  ejsData = {},
  ejsOptions: ejsOptions = {}
) => {
  const files = await globby(["**/*"], {
    cwd: dirPath,
    dot: true,
  });
  files.forEach((rawPath) => {
    const targetPath: string = rawPath
      .split("/")
      .map((filename) => {
        // ignore _ folder
        if (filename === "_") {
          return "_";
        }

        // dotfiles are ignored when published to npm, therefore in templates
        // we need to use underscore instead (e.g. "_gitignore")
        if (filename.charAt(0) === "_" && filename.charAt(1) !== "_") {
          return `.${filename.slice(1)}`;
        }
        if (filename.charAt(0) === "_" && filename.charAt(1) === "_") {
          return `${filename.slice(1)}`;
        }
        return filename;
      })
      .join("/");

    const filePath = path.join(dirPath, targetPath);
    const content = fs.readFileSync(filePath, "utf-8");
    const renderContent = ejs.render(content, ejsData, ejsOptions) as string;
    if (Buffer.isBuffer(renderContent) || /[^\s]/.test(renderContent)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (files as any)[targetPath] = renderContent;
    }
  });

  return files;
};

const fileHelper = {
  isFileExit,
  ensurePathFile,
  getFileMapByPath,
};

export default fileHelper;
