export declare function publish(options: {
  defaultPackage: string;
  getPkgDir?: (pkg: string) => string;
  /**
   * Enables npm package provenance https://docs.npmjs.com/generating-provenance-statements
   * @default false
   */
  provenance?: boolean;
  /**
   * Package manager that runs the publish command
   * @default "npm"
   */
  packageManager?: "npm" | "pnpm";
}): Promise<void>;
