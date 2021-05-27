type first<T, Arr extends T[]> =
  Arr extends [] ?
    undefined :
    Arr extends [infer First, ...infer Rest] ?
      First :
      T;

type firstOfSplit<ToSplit extends string, Delimiter extends string> =
  first<string, split<ToSplit, Delimiter>>;

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

export type {first, firstOfSplit, last, lastOfSplit, split};
