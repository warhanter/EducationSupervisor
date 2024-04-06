function reverseString(str, splitter = "") {
  // Step 1. Use the split() method to return a new array
  var splitString = str.split(splitter);
  // Step 2. Use the reverse() method to reverse the new created array
  var reverseArray = splitString.reverse();
  // Step 3. Use the join() method to join all elements of the array into a string
  var joinArray = reverseArray.join(splitter);
  //Step 4. Return the reversed string
  return joinArray;
}

export { reverseString };
