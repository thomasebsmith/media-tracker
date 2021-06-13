import {Then} from "./monad";

class None<T> {
  get hasValue(): false {
    return false;
  }

  get value(): null {
    return null;
  }

  bind<U>(_: Then<T, U>): Optional<U> {
    return none<U>();
  }

  pure(value: T): Optional<T> {
    return some(value);
  }

  valueOr(ifNone: T): T {
    return ifNone;
  }
}

class Some<T> {
  hasValue: true;
  value: T;

  constructor(value: T) {
    this.hasValue = true;
    this.value = value;
  }

  bind<U>(then: Then<T, U>): Optional<U> {
    return then(this.value) as Optional<U>;
  }

  pure(value: T): Optional<T> {
    return some(value);
  }

  valueOr(_: T): T {
    return this.value;
  }
}

type Optional<T> = None<T> | Some<T>;

function none<T>(): None<T> {
  return new None<T>();
}

function some<T>(value: T): Some<T> {
  return new Some<T>(value);
}

function optionalList<T>(list: Optional<T>[]): Optional<T[]> {
  const results: T[] = [];
  for (const element of list) {
    if (element.hasValue) {
      results.push(element.value);
    } else {
      return none();
    }
  }
  return some(results);
}

export {none, some, optionalList};
export type {Optional};
