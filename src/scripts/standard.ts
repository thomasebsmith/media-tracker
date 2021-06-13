function assert(value: boolean, message?: string): asserts value {
  if (!value) {
    throw Error(message ?? "Assertion failed");
  }
}

function fatalError(message?: string): never {
  throw Error(message ?? "Fatal error");
}

export {assert, fatalError};
