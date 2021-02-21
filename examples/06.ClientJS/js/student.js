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