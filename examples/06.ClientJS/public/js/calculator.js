//When the document is loaded in the browser then listen to btnCompute click event
document.addEventListener("DOMContentLoaded", () => {
    console.log("js-DOM fully loaded and parsed");
    document.querySelector('#btnCompute').addEventListener("click", handleCompute);
});

function handleCompute() {
    const num1 = parseInt( document.querySelector("#num1").value );
    const num2 = parseInt( document.querySelector("#num2").value );
    const operation = document.querySelector("#operation").value;
    const resultDiv = document.querySelector("#result");

    const calculator = new Calculator();
    let result;
    switch(operation) {
        case '+' :
            result = calculator.add(num1, num2);
            break;
        case '-' :
            result = calculator.subtract(num1, num2);
            break;
        case '*' :
            result = calculator.mutiply(num1, num2);
            break;
        case '/' :
            result = calculator.divide(num1, num2)
            break;
    }
    resultDiv.innerHTML = `${num1}  ${operation}  ${num2}  = ${result}`;
    console.log(result);
}

//Calculator class
class Calculator {
    add (a, b) {
        return a + b;
    }
    
    subtract (a, b) {
        return a - b;
    }
    
    mutiply (a, b) {
        return a * b;
    }
    
    divide (a, b) {
        return a / b;
    }
}

//Student class
class Student {
    constructor(firstName, lastName, gpa) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gpa = gpa;
    }

    getName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

