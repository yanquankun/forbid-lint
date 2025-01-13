import "core-js/actual/promise/with-resolvers";

interface IPromiseResult {
  reason: string | null;
  status: boolean;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data?: any;
}

/**
 * @description task promise wrap
 * @params promise Promise instance
 * @params resolve (value: { reason: string | null; status: boolean }) => void
 *         reason: 该resolve回调状态原因
 *         status: true 成功  false  失败
 * @returns void
 */
type PromiseResolver = (value: IPromiseResult) => void;

interface IPromiseWithResolvers<T> {
  promise: Promise<T>;
  resolve: PromiseResolver;
}

/**
 * @description 统一处理回调结果
 */
const withResultWarp = (
  fn: (resolve: PromiseResolver) => void
): Promise<IPromiseResult> => {
  const { promise, resolve } =
    Promise.withResolvers() as IPromiseWithResolvers<IPromiseResult>;

  try {
    fn(resolve);
  } catch (error) {
    resolve({
      reason:
        `${fn.name} call err:${JSON.stringify(error)}` ||
        `withResultWarp call ${fn} error`,
      status: false,
    });
  }

  return promise;
};

const helper = {
  withResultWarp,
};

export default helper;
