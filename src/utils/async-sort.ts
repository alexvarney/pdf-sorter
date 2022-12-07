/** Fn should return true if a is better than b */
type Comparator<T> = (a: T, b: T) => Promise<boolean>;

const merge = async <T>(
  left: T[],
  right: T[],
  comparator: Comparator<T>
): Promise<T[]> => {
  let arr: T[] = [];
  // Break out of loop if any one of the array gets empty
  while (left.length && right.length) {
    // Pick the smaller among the smallest element of left and right sub arrays
    if (await comparator(left[0], right[0])) {
      arr.push(left.shift() as T);
    } else {
      arr.push(right.shift() as T);
    }
  }

  // Concatenating the leftover elements
  // (in case we didn't go through the entire left or right array)
  return [...arr, ...left, ...right];
};

export const sortAsync = async <T>(
  array: T[],
  comparator: Comparator<T>
): Promise<T[]> => {
  const half = array.length / 2;

  // Base case or terminating case
  if (array.length < 2) {
    return array;
  }

  const left = array.splice(0, half);
  return await merge(
    await sortAsync(left, comparator),
    await sortAsync(array, comparator),
    comparator
  );
};
