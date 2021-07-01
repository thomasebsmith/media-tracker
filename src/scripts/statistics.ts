import {none, Optional, some} from "./optional";

function mean(data: Iterable<number>): number {
  let sum = 0;
  let count = 0;
  for (const datum of data) {
    sum += datum;
    ++count;
  }
  return sum / count;
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

export {mean, median, sum};
