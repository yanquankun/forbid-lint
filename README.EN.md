[中文文档](./README.md)

# forbid-lint

A plugin for frontend projects to prevent modifications to lint files. Since the purpose of this plugin is to avoid modifications to various lint files, it currently only supports configuring file names in the project root directory. Support for configuring sub-level file names will be added in the future.

### Plugin Usage

1. Installation

Global Installation

```shell
npm install forbid-lint -g
or
pnpm install forbid-lint -g
or
yarn add forbid-lint -g
````

Project Installation (Recommended)

```shell
npm install forbid-lint -D
or
pnpm install forbid-lint -D
or
yarn add forbid-lint -D
```

2. Usage

`There are two ways to use it, let's introduce the first one:`

---

**Manual Configuration File Creation**

1. Create a `.forbidrc.json` file in the project root directory with the following configuration:

```json
// Add the file names you don't want to be modified to lintFiles
{
  "lintFiles": [
    ".eslintrc.js",
    ".eslintrc.json",
    ".eslintrc.yml",
    xxx
  ]
}
```

TIP: If you don't create this file, the following default file names will be used for validation

```md
# Default files that are forbidden to modify

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

2. Install husky and configure the `pre-commit` hook. Installing and configuring husky is straightforward, you can refer to [husky guide](https://typicode.github.io/husky/). Add the following content to the pre-commit hook:

```shell
npx forbid-lint check
```

3. During git commit, the forbid-lint check command will be executed in the pre-commit hook. If any forbidden files are detected as modified, it will show a warning message and exit the git commit process.

---

### CLI Usage

**CLI Command Introduction**

![forbid-lint cli](https://www.yanquankun.cn/cdn/forbid-lint-cli.png)

1. forbid-lint init for initialization

2. forbid-lint check to detect if there are any forbidden files in the staging area

`TIP: If you encounter "sh: xxx/bin/forbid-lint: Permission denied" when running CLI commands, you can fix it by running:`

```shell
chmod +x xxx/forbid-lint/bin/forbid-lint
```

---

**CLI Configuration File Creation**

1. Run the following CLI command to initialize:

```shell
# For global installation
forbid-lint init

# For project installation
npx forbid-lint init
```

2.  Choose whether to automatically generate the following configurations based on the CLI tool's prompts:

        2.1 husky: Automatically install husky (9.1.7) plugin, create .husky directory, generate pre-commit hook, and configure the hook with forbid-lint check [You can also choose to reject automatic installation and install husky manually]

        2.2 .forbidrc.json: Automatically generate .forbidrc.json file in the project root directory with the following content: {"lintFiles": [".eslintrc.js", ".eslintrc.json", ".eslintrc.yml"]}

---

### Development

```json
pnpm dev
```

Start Node service and run src/index.ts

### Testing

```shell
pnpm test
```

1. Watch for changes in ts files in the src directory
2. Dynamically update forbid-lint library for the **demo** directory

### Build

```shell
pnpm build
```

### Unit Testing

```shell
pnpm jest
```

### Publishing

```shell
pnpm publishCI [x.y.z]
```

---

### Overall Flow Chart

![Overall Flow Chart](https://www.yanquankun.cn/cdn/forbid-lint.png)
