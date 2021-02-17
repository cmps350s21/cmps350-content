import {add, multiply} from './lib.js';
import path from 'path';

console.log('Result of add(2, 3) : ', add(2, 3));
console.log('Result of multiply(2, 3) : ', multiply(2, 3));

console.log("Current path: ", path.resolve());