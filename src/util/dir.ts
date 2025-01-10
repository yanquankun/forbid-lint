import path from "path";

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

export default {
  getProjectRoot,
};
