import readline from "readline";
import chalk from "chalk";
import stripAnsi from "strip-ansi";

const chalkTag = (msg: string) =>
  chalk.bgBlackBright.white.dim(` ${msg.toUpperCase()} `);

const format = (label: string, msg: string) => {
  return msg
    .split("\n")
    .map((line, i) => {
      return i === 0
        ? `${label} ${line}`
        : line.padStart(stripAnsi(label).length + line.length + 1);
    })
    .join("\n");
};

export default {
  chalk,
  log: (msg = "", tag: string = "") => {
    tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
  },
  info: (msg: string, tag: string = "") => {
    console.log(
      format(chalk.bgBlue.black(" INFO ") + (tag ? chalkTag(tag) : ""), msg)
    );
  },
  done: (msg: string, tag: string = "") => {
    console.log(
      format(chalk.bgGreen.black(" DONE ") + (tag ? chalkTag(tag) : ""), msg)
    );
  },
  warn: (msg: string, tag: string = "") => {
    console.warn(
      format(
        chalk.bgYellow.black(" WARN ") + (tag ? chalkTag(tag) : ""),
        chalk.yellow(msg)
      )
    );
  },
  error: (msg: string | Error, tag: string = "") => {
    console.error(
      format(
        chalk.bgRed(" ERROR ") + (tag ? chalkTag(tag) : ""),
        chalk.red(msg)
      )
    );
    if (msg instanceof Error) {
      console.error(msg.stack);
      console.log("error", tag, msg.stack);
    } else console.log("error", tag, msg);
  },
  clearConsole: (title: string) => {
    if (process.stdout.isTTY) {
      const blank = "\n".repeat(process.stdout.rows);
      console.log(blank);
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      if (title) {
        console.log(title);
      }
    }
  },
};
