interface None<T> {
  hasValue: false,
  value: null,
}

interface Some<T> {
  hasValue: true,
  value: T,
}

type Optional<T> = None<T> | Some<T>;

function none<T>(): None<T> {
  return {
    hasValue: false,
    value: null,
  };
}

function some<T>(value: T): Some<T> {
  return {
    hasValue: true,
    value: value,
  };
}

function valueOr<T>(maybe: Optional<T>, ifNone: T): T {
  return maybe.hasValue ? maybe.value : ifNone;
}

function optionalList<T>(list: Optional<T>[]): Optional<T[]> {
  const results: T[] = [];
  for (const element of list) {
    if (element.hasValue) {
      results.push(element.value!);
    } else {
      return none();
    }
  }
  return some(results);
}

export {none, some, optionalList, valueOr};
export type {Optional};
