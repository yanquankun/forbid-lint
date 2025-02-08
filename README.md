# forbid-lint

一个用于前端工程中禁止修改 lint 文件的插件，由于本插件目的是避免各种 lint 文件的修改，所以目前只支持配置项目根目录的配置文件名，后续会支持配置子级文件名~

### 使用插件

1. 安装

全局安装

```shell
npm install forbid-lint -g
or
pnpm install forbid-lint -g
or
yarn add forbid-lint -g
```

项目内安装

```shell
npm install forbid-lint -D
or
pnpm install forbid-lint -D
or
yarn add forbid-lint -D
```

2. 使用

`有两种使用方式，先介绍第一种：`

---

**手动创建配置文件方式**

1. 在项目的根目录创建`.forbidrc.json`文件，写入如下配置

```json
// 将不希望被修改的文件名写入到lintFiles中
{
  "lintFiles": [
    ".eslintrc.js",
    ".eslintrc.json",
    ".eslintrc.yml",
    xxx
  ]
}
```

TIP：如果不创建该文件，将以如下默认配置的文件名进行校验

```md
# 默认禁止修改文件

.eslintrc.js
.eslintrc.cjs
.eslintrc.yaml
.eslintrc.yml
.eslintrc.json
eslint.config.js
eslint.config.mjs
eslint.config.cjs
eslint.config.ts
eslint.config.mts
eslint.config.cts
```

2. 安装 husky 并配置 husky 的`pre-commit`钩子，安装配置 husky 比较简单，可自行参考[husky guide](https://typicode.github.io/husky/)，在 pre-commitgound 钩子中添加如下内容

```shell
npx forbid-lint check
```

3. git 提交时，将在 pre-commit 钩子中执行 forbid-lint check 命令，如果检测到有文件被修改，则提示不允许修改，并退出 git 提交流程

---

### cli 使用

**cli 命令介绍**

![forbid-lint cli](https://www.yanquankun.cn/cdn/forbid-lint-cli.png)

1. forbid-lint init 进行初始化

2. forbid-lint check 检测暂存区是否存在禁止修改的文件

---

**cli 创建配置文件方式**

1. 运行如下 cli 命令进行初始化

```shell
# 全局安装运行
forbid-lint init

# 项目内安装运行
npx forbid-lint init
```

2.  根据 cli 工具的提示选择是否自动生成如下配置

        2.1 husky：自动安装husky（9.1.7）插件，自动创建.husky目录，自动生成pre-commit钩子，并自动配置该钩子为forbid-lint check 【也可以选择拒绝自动安装，选择自己安装husky】

        2.2 .frobidrc.json：自动在项目根目录生成.forbidrc.json文件，并写入如下内容{"lintFiles": [".eslintrc.js", ".eslintrc.json", ".eslintrc.yml"]}

---

### 开发

```json
pnpm dev
```

启动 Node 服务，并运行 src/index.ts

### 测试

```shell
pnpm test
```

1. 监听 src 中 ts 文件修改
2. 为**test**目录动态更新 forbid-lint 库

### 打包

```shell
pnpm build
```

### 单元测试

```shell
pnpm jest
```

---

### 整体流程图

![整体流程图](https://www.yanquankun.cn/cdn/forbid-lint.png)
