class Calculator {
    add(x, y) {
        return x + y
    }

    subtract(x, y) {
        return x - y
    }

    multiply(x, y) {
        return x * y
    }

    divide(x, y) {
        if (y === 0) {
            throw "Invalid input";
        } else {
            return x / y
        }
    }

}

module.exports = new Calculator();
