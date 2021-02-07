
let nums = [1, 2, 3, 4, 5, 6, 7, 8];
let squaredEvenNums = [];
for (const num of nums) {
    if (num % 2 === 0) {
        squaredEvenNums.push(num ** 2);
    }
}
console.log("squaredEvenNums:", squaredEvenNums);

//Get even numbers then square them. This is an example of Chaining!
nums = [1, 2, 3, 4, 5, 6, 7, 8];
squaredEvenNums = nums.filter(x => x % 2 === 0).map(x => x ** 2);
console.log("squaredEvenNums:", squaredEvenNums);
// [ 1, 9, 25, 49 ]

//Compute the sum using the reduce function
let sum = nums.reduce( (prev, curr) => prev + curr );
console.log("Sum of array elements: ", sum);

//Flatten the array: transform from 2D array to a simple array
let flattened = [[0, 1], [2, 3], [4, 5]].reduce( ( acc, cur ) => acc.concat(cur) );
console.log("flattened array:", flattened);