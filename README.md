# forbid-lint

一个用于前端工程中禁止修改 lint 文件的插件

### 使用插件

1. 安装

```shell

```

2. 生成`.forbidrc.json`文件，当然，你也可以不创建该文件，那么将会按步骤三的配置进行校验

```shell
# 方式一
xxx
# 方式二
手动在项目根目录中创建.forbidrc.json文件，并写入
```

3. 配置`.forbidrc.json`文件，该文件中 lintFiles 列表中的文件禁止修改，如果文件配置为空或者没有该文件，会按照如下列表中进行默认配置

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

```json
// .forbidrc.json
{
  "lintFiles": [".eslintrc.js", ".eslintrc.json", ".eslintrc.yml", ...] // 该配置中的所有文件禁止被修改
}
```

4. 生成 githooks 文件

````shell
# 方式一
在项目根目录中手动创建如下路径文件.git/hooks/pre-commit文件，
# 方式二
xxx

5. 配置`pre-commit`内容

```shell
xxx
```

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
````
