function assert(value: boolean, message?: string): asserts value {
  if (!value) {
    throw Error(message ?? "Assertion failed");
  }
}

export {assert};
