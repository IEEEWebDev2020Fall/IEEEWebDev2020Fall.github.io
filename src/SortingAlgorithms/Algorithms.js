import { sort } from "d3";

// Merge Sort
export function getMergeSortAnimation(array, startIndex, size, animations) {
  if (size > 1) {
    const leftArraySize = Math.floor(size / 2);
    const rightArraySize = size - leftArraySize;

    getMergeSortAnimation(array, startIndex, leftArraySize, animations);
    getMergeSortAnimation(
      array,
      startIndex + leftArraySize,
      rightArraySize,
      animations
    );
    merge(array, startIndex, leftArraySize, rightArraySize, animations);
  }
}

const merge = (
  array,
  startIndex,
  leftArraySize,
  rightArraySize,
  animations
) => {
  var tempArr = [];
  var copied = 0;
  var leftCopied = 0;
  var rightCopied = 0;
  const isLastMerge = rightArraySize + leftArraySize === array.length;

  while (leftCopied < leftArraySize && rightCopied < rightArraySize) {
    // Add comparison animation
    animations.push([
      startIndex + leftCopied,
      startIndex + leftArraySize + rightCopied,
      isLastMerge,
    ]);
    animations.push([
      startIndex + leftCopied,
      startIndex + leftArraySize + rightCopied,
      isLastMerge,
    ]);
    if (
      array[startIndex + leftCopied] <
      array[startIndex + leftArraySize + rightCopied]
    ) {
      // Add override animation
      animations.push([
        startIndex + copied,
        array[startIndex + leftCopied],
        isLastMerge,
      ]);
      animations.push([
        startIndex + copied,
        array[startIndex + leftCopied],
        isLastMerge,
      ]);
      tempArr[copied++] = array[startIndex + leftCopied++];
    } else {
      // Add override animation
      animations.push([
        startIndex + copied,
        array[startIndex + leftArraySize + rightCopied],
        isLastMerge,
      ]);
      animations.push([
        startIndex + copied,
        array[startIndex + leftArraySize + rightCopied],
        isLastMerge,
      ]);
      tempArr[copied++] = array[startIndex + leftArraySize + rightCopied++];
    }
  }

  while (leftCopied < leftArraySize) {
    animations.push([
      startIndex + leftCopied,
      startIndex + leftCopied,
      isLastMerge,
    ]);
    animations.push([
      startIndex + leftCopied,
      startIndex + leftCopied,
      isLastMerge,
    ]);
    animations.push([
      startIndex + copied,
      array[startIndex + leftCopied],
      isLastMerge,
    ]);
    animations.push([
      startIndex + copied,
      array[startIndex + leftCopied],
      isLastMerge,
    ]);
    tempArr[copied++] = array[startIndex + leftCopied++];
  }

  while (rightCopied < rightArraySize) {
    animations.push([
      startIndex + leftArraySize + rightCopied,
      startIndex + leftArraySize + rightCopied,
      isLastMerge,
    ]);
    animations.push([
      startIndex + leftArraySize + rightCopied,
      startIndex + leftArraySize + rightCopied,
      isLastMerge,
    ]);
    animations.push([
      startIndex + copied,
      array[startIndex + leftArraySize + rightCopied],
      isLastMerge,
    ]);
    animations.push([
      startIndex + copied,
      array[startIndex + leftArraySize + rightCopied],
      isLastMerge,
    ]);
    tempArr[copied++] = array[startIndex + leftArraySize + rightCopied++];
  }

  for (let i = 0; i < tempArr.length; i++) {
    array[i + startIndex] = tempArr[i];
  }
};

// Bubble Sort
export function getBubbleSortAnimation(array, animations) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      let isSwap;
      let isSorted = false;
      if (array[j] > array[j + 1]) {
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        isSwap = true;
      } else {
        isSwap = false;
      }
      if (j === array.length - i - 2) {
        isSorted = true;
      }
      animations.push([false, j]);
      animations.push([isSwap, j]);
      animations.push([isSorted, j]);
    }
  }
  animations.push([true, 0]);
}

// Insertion Sort
export function getInsertionSortAnimation(array, animations) {
  for (let i = 1; i < array.length; i++) {
    animations.push([0, 0, i]);
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      animations.push([1, 0, j]);
      animations.push([1, 1, j]);
      animations.push([1, 2, j]);
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;
    animations.push([2, 0, j]);
    animations.push([2, 1, j]);
  }
}

// Quick Sort
export function getQuickSortAnimation(array, low, high, animations) {
  if (low < high) {
    let pi = partition(array, low, high, animations);
    getQuickSortAnimation(array, low, pi - 1, animations);
    getQuickSortAnimation(array, pi + 1, high, animations);
  } else if (low === high) {
    animations.push([0, 3, high]);
  }
}

const partition = (array, low, high, animations) => {
  let pivot = array[high];
  // Color pivot
  animations.push([0, 0, high]);
  let i = low - 1;
  for (let j = low; j <= high - 1; j++) {
    if (array[j] < pivot) {
      // color
      animations.push([0, 1, j]);
      i++;
      if (i != j) {
        // swap
        animations.push([1, i, j]);
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    } else {
      // color
      animations.push([0, 2, j]);
    }
  }
  // swap
  animations.push([1, i + 1, high]);
  // De-color
  animations.push([2, -1, -1]);
  let temp = array[i + 1];
  array[i + 1] = array[high];
  array[high] = temp;
  return i + 1;
};

const assertEqualsArray = (original, sorted) => {
  let correct = original.slice().sort();
  if (correct.length !== sorted.length) {
    return false;
  }
  correct.every((element, i) => {
    if (element !== sorted[i]) {
      return false;
    }
  });
  return true;
};
