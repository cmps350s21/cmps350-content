import * as module1 from './module1.js';

function getGreeting () {
    let element = document.createElement('div');
    element.innerHTML = module1.greet();
    return element;
}

console.log("from app.js");
document.body.appendChild( getGreeting() );