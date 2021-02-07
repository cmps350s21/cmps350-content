﻿let numbers = [1, 2, 3, 4, 5];
console.log(numbers.join("|")); // result: 1|2|3|4|5

let tail = numbers.pop();               // tail = 5;
console.log("Remove element at the end (tail)");
console.log("Removed: " + tail);
console.log(numbers.join("|")); // result: 1|2|3|4

numbers.unshift(10);
console.log("Insert 10 at the start (head)");
console.log(numbers.join("|")); // result: 10|1|2|3|4

let head = numbers.shift();             // head=10;
console.log("Removed: " + head);
console.log(numbers.join("|")); // result: 1|2|3|4

/*
 The splice() method adds/removes items to/from an nums, and returns the removed item(s).
 Note: This method changes the original nums.
 Syntax
 nums.splice(index,howmany,item1,.....,itemX)
 */
console.log("numbers: " + numbers);
let deleted = numbers.splice(0, 2, "one", "two", "three");

console.log('deleted after [1, 2, 3, 4, 5].splice(0, 2, "one", "two", "three"): ');
console.log("elements deleted: " + deleted);
console.log("numbers after: " + numbers);