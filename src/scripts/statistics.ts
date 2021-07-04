import {none, Optional, some} from "./optional";

function *map<T, U>(func: (input: T) => U, iterable: Iterable<T>): Iterable<U> {
  for (const datum of iterable) {
    yield func(datum);
  }
}

function *filterNulls<T>(iterable: Iterable<T | null>): Iterable<T> {
  for (const datum of iterable) {
    if (datum !== null) {
      yield datum;
    }
  }
}

function mean(data: Iterable<number>): Optional<number> {
  let sum = 0;
  let count = 0;
  for (const datum of data) {
    sum += datum;
    ++count;
  }
  if (count === 0) {
    return none();
  }
  return some(sum / count);
}

type CompareFunc<T> = (first: T, second: T) => number;

function median<T>(
  data: Iterable<T>,
  compare: CompareFunc<T> | null = null
): Optional<T> {
  // TODO: This is not the optimal algorithm.
  const dataArray = [...data];
  if (compare === null) {
    dataArray.sort();
  } else {
    dataArray.sort(compare);
  }
  const length = dataArray.length;
  if (length === 0) {
    return none();
  }
  if (length % 2 === 0) {
    // Return the first datum instead of averaging so that median works with
    // non-numeric data.
    return some(dataArray[length / 2 - 1]);
  }
  return some(dataArray[(length - 1) / 2]);
}

function sum(data: Iterable<number>): number {
  let theSum = 0;
  for (const datum of data) {
    theSum += datum;
  }
  return theSum;
}

function count<T>(data: Iterable<T>): number {
  // TODO: This can be optimized for arrays.
  let count = 0;
  for (const _ of data) {
    ++count;
  }
  return count;
}

function stdev(data: Iterable<number>): Optional<number> {
  return mean(data).bind(theMean => {
    const numerator = sum(map(datum => (datum - theMean) ** 2, data));
    const denominator = count(data);
    return some(Math.sqrt(numerator / denominator));
  });
}

export {count, filterNulls, map, mean, median, stdev, sum};
