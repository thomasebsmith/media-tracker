// Statically get the first element of an array type.
type first<T, Arr extends T[]> =
  Arr extends [] ?
    undefined :
    Arr extends [infer First, ...infer _] ?
      First :
      T;

// Statically get the first element of a string split by a delimeter.
type firstOfSplit<ToSplit extends string, Delimiter extends string> =
  first<string, split<ToSplit, Delimiter>>;

// Statically get the last element of an array type.
type last<T, Arr extends T[]> =
  Arr extends [] ?
    undefined :
    Arr extends [...infer _, infer Last] ?
      Last :
      T;

// Statically get the last element of a string split by a delimeter.
type lastOfSplit<ToSplit extends string, Delimiter extends string> =
  last<string, split<ToSplit, Delimiter>>;

// Statically split a string by a delimeter.
type split<ToSplit extends string, Delimiter extends string> =
  string extends ToSplit ?
    string[] :
    string extends "" ?
      [] :
      ToSplit extends `${infer Before}${Delimiter}${infer After}` ?
        [Before, ...split<After, Delimiter>] :
        [ToSplit];

export type {first, firstOfSplit, last, lastOfSplit, split};
