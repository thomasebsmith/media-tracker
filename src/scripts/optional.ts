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

  toString(): string {
    return "none()";
  }
}

class Some<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  get hasValue(): true {
    return true;
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

  toString(): string {
    return `some(${this.value})`;
  }
}

// Has methods bind, pure, and valueOr.
type Optional<T> = None<T> | Some<T>;

// Create an instance of None.
function none<T>(): None<T> {
  return new None<T>();
}

// Create an instance of Some holding `value`.
function some<T>(value: T): Some<T> {
  return new Some<T>(value);
}

// If all the elements of `list` are not None, return
// some(the values of the elements of `list`). Else, return None.
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
