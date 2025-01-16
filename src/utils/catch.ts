import log from "./log";
import os from "os";

const getEnvInfo = () => {
  const nodeVer = process.version;
  const platform = os.platform();
  const arch = os.arch();
  const version = os.version();

  return `Node.js 环境信息:\nNode.js 版本: ${nodeVer}\n操作系统信息:\n系统平台: ${platform}\n系统架构: ${arch}\n系统版本: ${version}`;
};

const showErrorInfo = (err: Error | string) => {
  log.warn(
    log.chalk.bgYellow(
      "检测到进程出现不可预测异常，如确为异常，可复制错误信息反馈至（https://github.com/yanquankun/forbid-lint/issues）issues，相关错误如下："
    ),
    "process error"
  );
  log.info(
    typeof err === "string"
      ? err
      : `${JSON.stringify(err.name)}：${JSON.stringify(err.message)}`,
    "错误信息"
  );

  const envInfo = getEnvInfo();
  log.info(envInfo, "环境信息");

  process.exit(1);
};

// catch global error
process.on("uncaughtException", (err) => showErrorInfo(err));

// catch promise error
process.on("unhandledRejection", (reason) =>
  showErrorInfo(JSON.stringify(reason))
);
