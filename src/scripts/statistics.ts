import {none, Optional, some} from "./optional";

// Applies a function to each element of an iterable.
function *map<T, U>(func: (input: T) => U, iterable: Iterable<T>): Iterable<U> {
  for (const datum of iterable) {
    yield func(datum);
  }
}

// Removes all nulls from an iterable.
function *filterNulls<T>(iterable: Iterable<T | null>): Iterable<T> {
  for (const datum of iterable) {
    if (datum !== null) {
      yield datum;
    }
  }
}

// Calculates the mean of an iterable.
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

// Calculates the median of an iterable. Note that to make this work for
//  non-numeric data, the first ("left") datum is returned if there are two
//  middle elements.
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

// Calculates the sum of an iterable.
function sum(data: Iterable<number>): number {
  let theSum = 0;
  for (const datum of data) {
    theSum += datum;
  }
  return theSum;
}

// Calculates the number of items in an iterable.
function count<T>(data: Iterable<T>): number {
  // TODO: This can be optimized for arrays.
  let count = 0;
  for (const _ of data) {
    ++count;
  }
  return count;
}

// Calculates the standard deviation of an iterable.
function stdev(data: Iterable<number>): Optional<number> {
  // TODO: This could be more efficient using a tee or similar.
  const dataArray = [...data];
  return mean(dataArray).bind(theMean => {
    const numerator = sum(map(datum => (datum - theMean) ** 2, dataArray));
    const denominator = count(dataArray);
    return some(Math.sqrt(numerator / denominator));
  });
}

type EqualFunc<T> = (first: T, second: T) => boolean;

// Filters an iterable to only its unique elements.
function *unique<T>(
  data: Iterable<T>,
  equal: EqualFunc<T> | null = null
): Iterable<T> {
  if (equal === null) {
    const previousData: Set<T> = new Set();
    for (const datum of data) {
      if (!previousData.has(datum)) {
        previousData.add(datum);
        yield datum;
      }
    }
  } else {
    const previousData: T[] = [];

    outer:
    for (const datum of data) {
      for (const prevDatum of previousData) {
        if (equal(datum, prevDatum)) {
          continue outer;
        }
      }
      yield datum;
    }
  }
}

export {count, filterNulls, map, mean, median, stdev, sum, unique};
