const  greeting = require('./greeting');
const circle = require('./circle');

let text = greeting.yahala();
console.log(text);

let r = 4;
console.log(`The area of radius ${r}: ${circle.area(r)}
and its circumference is: ${circle.circumference(r)}`);
