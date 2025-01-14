import path from "path";
import helper from "./helper";
import fs from "fs-extra";
import fileHelper from "./file";

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
    return "";
  }
}

/**
 * @description find forbid-lint project template path
 */
function getTemplatePath(): ReturnType<typeof helper.withResultWarp> {
  return helper.withResultWarp((resolve) => {
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

async function isLibraryListedInPackageJson(moduleName: string) {
  const packageJsonPath = await getProjectRoot();

  if (!packageJsonPath) {
    return false;
  }

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(packageJsonPath!, "package.json"), "utf-8")
  );

  const allDependencies = [
    ...Object.keys(packageJson?.dependencies ?? []),
    ...Object.keys(packageJson?.devDependencies ?? []),
  ];

  return Boolean(allDependencies.includes(moduleName));
}

async function getModuleIsInstalled(moduleName: string) {
  moduleName = moduleName.trim();
  try {
    // find cjs package has vaild main field
    require.resolve(moduleName, {
      paths: [process.cwd()],
    });
    return true;
  } catch (error) {
    // find all deps from package.json
    const bol = await isLibraryListedInPackageJson(moduleName);

    return bol ?? false;
  }
}

const getPkgManage = async () => {
  const pkgRoot = await getProjectRoot();

  let pkgManage: "npm" | "yarn" | "pnpm" = "npm";

  if (fileHelper.isFileExit(path.join(pkgRoot, "package.json"))) {
    pkgManage = "npm";
  }
  if (fileHelper.isFileExit(path.join(pkgRoot, "yarn.lock"))) {
    pkgManage = "yarn";
  }
  if (fileHelper.isFileExit(path.join(pkgRoot, "pnpm-lock.yaml"))) {
    pkgManage = "pnpm";
  }

  return pkgManage;
};

const dirHelper = {
  getProjectRoot,
  getTemplatePath,
  getModuleIsInstalled,
  getPkgManage,
};

export default dirHelper;
