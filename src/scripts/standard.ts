// Assert that `value` is true. If not, throw an Error (optionally with a
//  specified message).
function assert(value: boolean, message?: string): asserts value {
  if (!value) {
    throw Error(message ?? "Assertion failed");
  }
}

// Throw an Error (optionally with a specified message).
function fatalError(message?: string): never {
  throw Error(message ?? "Fatal error");
}

export {assert, fatalError};
