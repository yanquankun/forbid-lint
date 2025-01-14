interface IPromptThenable {
  (value: unknown): void | PromiseLike<void>;
}

export { IPromptThenable };
