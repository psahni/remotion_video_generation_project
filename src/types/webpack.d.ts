interface WebpackRequireContext {
  keys(): string[];
  <T>(id: string): T;
}

declare namespace NodeJS {
  interface Require {
    context(
      directory: string,
      useSubdirectories: boolean,
      expression: RegExp,
    ): WebpackRequireContext;
  }
}
