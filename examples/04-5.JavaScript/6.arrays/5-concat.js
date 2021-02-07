﻿let numbers = [5, 4, 23, 2];
let numbers2 = [1, 2, 3, 4, 5, 6];

let allNumbers = numbers.concat(numbers2);

console.log("[5, 4, 23, 2].concat([1, 2, 3, 4, 5, 6]): ", allNumbers.join(", "));

//Better way of concatenating using the Spead syntax
allNumbers = [...numbers, ...numbers2, 20, 30];
console.log(allNumbers.join(", "));

let parts = ['shoulders', 'knees'];
let body = ['head', ...parts, 'toes', 'face'];
console.log(body.join(", "));