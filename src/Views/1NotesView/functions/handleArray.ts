export function replaceNthElement<T>(arr: T[], n: number, newValue: T): T[]  {
    // Create a copy of the original array
    let newArray = [...arr];
    
    // Replace the nth element with the new value if it is within the array bounds
    if (n >= 0 && n < newArray.length) {
        newArray[n] = newValue;
    }
    
    return newArray;
};

export function removeElementAtIndex<T>(array: T[], index: number): T[] {
    // This returns a new array with the element at the specified index removed.
    return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function replaceElement<T>(arr: T[], target: T, replacement: T): T[] {
    const index = arr.indexOf(target);
    if (index !== -1) {
      arr[index] = replacement;
    }
    return arr;
}

