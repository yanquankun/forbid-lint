import program from "commander";
import fs from "fs";
import path from "path";
import log from "../util/log";

export default function () {
  const pkg = fs.readFileSync(path.join(__dirname, "../../package.json"), {
    encoding: "utf-8",
  });

  program
    .name("forbid-lint")
    .description("一个用于前端工程中禁止修改 lint 文件的插件")
    .option("-d, --debug", "开启初始化mps目录debug模式")
    .version(JSON.parse(pkg).version);

  program
    .command("init")
    .description("该命令将帮你初始化.forbidrc.json文件，")
    .option("-d, --debug", "开启初始化mps目录debug模式")
    .option(
      "-f, --force <path>",
      "强制在当前目录初始化cli结构，强制会直接在当前目录安装。有可能你的项目是monorepo结构，虽然你可以给每个子包都安装mpscli，但建议只维护一个mpscli配置目录"
    )
    .action(async (name) => {
      console.log(name);
    });

  program.on("command:*", ([cmd]) => {
    console.log(123);
  });

  program.on("--help", () => {
    console.log();
    log.info(` 运行 ${log.chalk.cyan(`mpscli <command> --help`)} 获取指令帮助`);
    log.info(` ${log.chalk.red(`所有指令请在与.mps同级目录进行操作`)} `);
    console.log();
  });

  program.parse();
}
