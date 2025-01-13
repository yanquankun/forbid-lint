import ora from "ora";
import type { Ora } from "ora";

const createSpinner = (): Ora => {
  const spinner = ora();

  return new Proxy(spinner, {
    get(target, prop, receiver) {
      const originalProperty = Reflect.get(target, prop, receiver);

      if (typeof originalProperty === "function") {
        return <T>(...args: T[]) => {
          if (prop === "start") {
            target.clear();
            target.stop();
          }

          if (prop === "stop") {
            target.clear();
          }

          if (prop === "succeed" || prop === "fail") {
            target.stop();
          }

          let result;
          try {
            result = originalProperty.apply(target, args);
          } catch (e) {}

          return result;
        };
      }

      return originalProperty;
    },
  });
};

const spinner = createSpinner();

export default spinner;
