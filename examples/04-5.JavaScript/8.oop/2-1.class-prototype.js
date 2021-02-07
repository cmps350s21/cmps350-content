class Circle {
    constructor(r) {
        this.radius = r;
    }
}
let circle = new Circle(3.5);

//Add getArea method to the class at runtime
Circle.prototype.getArea = function () {
    return Math.PI * this.radius * 2;
}

let area = circle.getArea();
console.log(area);  // 21.9
