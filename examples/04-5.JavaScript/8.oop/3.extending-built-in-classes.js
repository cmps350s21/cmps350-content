
Array.prototype.getMax = function() {
    let max = Math.max(...this);
    return max;
}

let numbers = [9, 1, 11, 3, 4];
let max = numbers.getMax();

//adding a method to arrays to sum their number elements
Array.prototype.sum = function() {
    let sum = this.reduce((prev, curr) => prev + curr)
    return sum;
}

numbers = [9, 1, 11, 3, 4];
max = numbers.getMax();
console.log(`[${numbers.join(', ')}].getMax() = ${max}`);

console.log(`[${numbers.join(', ')}].sum() = ${numbers.sum()}`);