export const  isArrayofStrings = (arr:Array<string>):Boolean =>  {
  // Check if arr is an array
  if (!Array.isArray(arr)) {
    return false;
  }

  // Check if all elements in the array are strings
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== 'string') {
      return false;
    }
  }

  // If all elements are strings, return true
  return true;
}