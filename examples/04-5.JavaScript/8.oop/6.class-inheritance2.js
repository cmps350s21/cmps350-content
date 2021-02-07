class Person {
    constructor (name) {
        this.name = name;
    }
    greeting () {
        return `Salam! I am ${this.name}`;
    }
}

let me = new Person("Saleh");
console.log(me.name);
console.log(me.greeting());
//Can add a property to an object
me.city = "Doha";
console.log(me.city);


class Student extends Person {
    constructor (name, gpa) {
        super(name);
        this.gpa = gpa;
    }

    greet () {
        return `${super.greet()}. My gpa is ${this.gpa}`;
    }
}

let student1 = new Student("Ahmed", 21);
console.log(student1.name);
console.log(student1.age);

class Teacher extends Person {
    constructor (name, area)
    {
        super(name);
        this.name = name;
        this.area = area;
    }

    greet () {
        return `${super.greet()}. My area is ${this.area}`;
    }
}

let ali = new Teacher('Ali Ramadan', 'Usul Al-fiqh');

//Override greet function for Ali
ali.greet = function() {
        return `Salamou Aleikoum Wa Rahmatu Allah Wa Barakatuhu! Akhokum Fi Lah ${this.name}. Mudaris ${this.area}.`;
};

let people = [
    new Teacher('Joha', 'Math'),
    new Student('Samir', 3.5),
    new Person('Salaheddine'),
    new Teacher('Moza', 'Literature'),
    ali
];

//I can extend the class. All objects will pick up the new definitions
Person.prototype.nationality = 'Qatari';

Person.prototype.greet = function() {
    return `Salam! I am ${this.name}. I am ${this.nationality}`;
}

for(let person of people) {
    console.log(person.greet());
}

console.log('ali instanceof Teacher: ', ali instanceof Teacher);
console.log('people[1] instanceof Teacher: ', people[1] instanceof Teacher);
console.log('ali instanceof Object: ', ali instanceof Object);

//Get the Class Type of an object
console.log('Object.getPrototypeOf(ali): ', Object.getPrototypeOf(ali));
console.log('Object.getPrototypeOf(people[1]): ', Object.getPrototypeOf(people[1]));
console.log('Object.getPrototypeOf(Object): ', Object.getPrototypeOf(Object));

/*
console.log('ali.__proto__ : ', ali.__proto__);
console.log('Teacher.__proto__ : ', Teacher.__proto__);
console.log('Person.__proto__ : ', Person.__proto__);
*/