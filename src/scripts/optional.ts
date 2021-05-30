import {Then} from "./monad";

class None<T> {
  get hasValue(): false {
    return false;
  }

  get value(): null {
    return null;
  }

  bind(then: Then<Optional<T>, T>): Optional<T> {
    return this;
  }

  pure(value: T): Optional<T> {
    return some(value);
  }
}

class Some<T> {
  hasValue: true;
  value: T;

  constructor(value: T) {
    this.hasValue = true;
    this.value = value;
  }

  bind(then: Then<Optional<T>, T>): Optional<T> {
    return then(this.value);
  }

  pure(value: T): Optional<T> {
    return some(value);
  }
}

type Optional<T> = None<T> | Some<T>;

function none<T>(): None<T> {
  return new None<T>();
}

function some<T>(value: T): Some<T> {
  return new Some<T>(value);
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
