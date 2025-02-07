import type { Config } from "jest";
/** @type {import('ts-jest').JestConfigWithTsJest} */

const config: Config = {
  verbose: true,
  // 指定使用 ts-jest 作为预处理器
  preset: "ts-jest",
  clearMocks: true,
  testEnvironment: "node",
  rootDir: "./",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  testPathIgnorePatterns: ["/node_modules/", "dist/"],
};

export default config;
