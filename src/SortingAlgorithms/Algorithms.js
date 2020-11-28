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

  while (leftCopied < leftArraySize && rightCopied < rightArraySize) {
    // Add comparison animation
    animations.push([
      startIndex + leftCopied,
      startIndex + leftArraySize + rightCopied,
    ]);
    animations.push([
      startIndex + leftCopied,
      startIndex + leftArraySize + rightCopied,
    ]);
    if (
      array[startIndex + leftCopied] <
      array[startIndex + leftArraySize + rightCopied]
    ) {
      // Add overide animation
      animations.push([startIndex + copied, array[startIndex + leftCopied]]);
      tempArr[copied++] = array[startIndex + leftCopied++];
    } else {
      // Add overide animation
      animations.push([
        startIndex + copied,
        array[startIndex + leftArraySize + rightCopied],
      ]);
      tempArr[copied++] = array[startIndex + leftArraySize + rightCopied++];
    }
  }

  while (leftCopied < leftArraySize) {
    animations.push([startIndex + leftCopied, startIndex + leftCopied]);
    animations.push([startIndex + leftCopied, startIndex + leftCopied]);
    animations.push([startIndex + copied, array[startIndex + leftCopied]]);
    tempArr[copied++] = array[startIndex + leftCopied++];
  }

  while (rightCopied < rightArraySize) {
    animations.push([
      startIndex + leftArraySize + rightCopied,
      startIndex + leftArraySize + rightCopied,
    ]);
    animations.push([
      startIndex + leftArraySize + rightCopied,
      startIndex + leftArraySize + rightCopied,
    ]);
    animations.push([
      startIndex + copied,
      array[startIndex + leftArraySize + rightCopied],
    ]);
    tempArr[copied++] = array[startIndex + leftArraySize + rightCopied++];
  }

  for (let i = 0; i < tempArr.length; i++) {
    array[i + startIndex] = tempArr[i];
  }
};
