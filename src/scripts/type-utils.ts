type first<T, Arr extends T[]> =
  Arr extends [] ?
    undefined :
    Arr extends [infer First, ...infer Rest] ?
      First :
      T;

type last<T, Arr extends T[]> =
  Arr extends [] ?
    undefined :
    Arr extends [...infer Rest, infer Last] ?
      Last :
      T;

type lastOfSplit<ToSplit extends string, Delimiter extends string> =
  last<string, split<ToSplit, Delimiter>>;

type split<ToSplit extends string, Delimiter extends string> =
  string extends ToSplit ?
    string[] :
    string extends "" ?
      [] :
      ToSplit extends `${infer Before}${Delimiter}${infer After}` ?
        [Before, ...split<After, Delimiter>] :
        [ToSplit];

interface Optional<T> {
  hasValue: boolean,
  value: T|null,
}

function none<T>(): Optional<T> {
  return {
    hasValue: false,
    value: null,
  };
}

function some<T>(value: T): Optional<T> {
  return {
    hasValue: true,
    value: value,
  };
}

function valueOr<T>(maybe: Optional<T>, ifNone: T): T {
  return maybe.hasValue ? maybe.value! : ifNone;
}

export {none, some, valueOr};
export type {last, lastOfSplit, split, Optional};
