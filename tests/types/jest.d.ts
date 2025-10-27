/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWith(...args: any[]): R;
    }
  }
}

export {};
