import program from "commander";
import fs from "fs";
import path from "path";
import log from "../util/log";
import dir from "../util/dir";

export default function () {
  const pkg = fs.readFileSync(path.join(__dirname, "../../package.json"), {
    encoding: "utf-8",
  });

  program
    .name("forbid-lint")
    .description(
      log.chalk.bgBlueBright.black("一个用于前端工程中禁止修改 lint 文件的插件")
    )
    .version(JSON.parse(pkg).version);

  program
    .command("init")
    .description(
      log.chalk.bgBlueBright.black(
        "该命令将帮你初始化.forbidrc.json文件，如果你的项目中已存在该文件，该命令将不会进行任何操作"
      )
    )
    .option("-f, --force", "强制覆盖已存在的.forbidrc.json文件")
    .action(async (name) => {
      console.log(name);
      console.log(await dir.getProjectRoot());
    });

  program.on("command:*", ([cmd]) => {
    log.warn(` ${log.chalk.red(`${cmd} 命令不存在，请检查命令是否正确`)}`);
  });

  program.on("--help", () => {
    console.log();
    log.info(
      ` 运行 ${log.chalk.cyan(`forbid-lint <command> --help|-h`)} 获取指令帮助`
    );
    console.log();
  });

  program.parse();
}
