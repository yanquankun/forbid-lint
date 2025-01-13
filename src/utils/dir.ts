import path from "path";
import helper from "./helper";

/**
 * @description 获取项目根目录
 * @param [target="package.json"] 以目标文件作为根目录查询条件
 * @returns Promise<string | null>
 */
async function getProjectRoot(target: string = "package.json") {
  // esm async import
  const { findUp } = await import("find-up");

  const packageJsonPath = await findUp(target);

  if (packageJsonPath) {
    const projectRoot = path.dirname(packageJsonPath);
    return projectRoot;
  } else {
    return null;
  }
}

/**
 * @description find forbid-lint project template path
 */
function getTemplatePath(): ReturnType<typeof helper.resultPromiseWrap> {
  return helper.resultPromiseWrap((resolve) => {
    try {
      resolve({
        reason: null,
        status: true,
        data: path.resolve(__dirname, "../template"),
      });
    } catch (error) {
      resolve({ reason: JSON.stringify(error), status: false, data: null });
    }
  });
}

export default {
  getProjectRoot,
  getTemplatePath,
};
