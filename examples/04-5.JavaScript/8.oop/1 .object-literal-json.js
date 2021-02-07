let person = {
    firstName: "Salaheddine",
    lastName: "Al-Ayoubi",
    id: 123,

    get fullName () {
        return `${this.firstName} ${this.lastName}`;
    },

    getFullName () {
            return `${this.firstName} ${this.lastName}`;
    }
};

console.log(person.firstName);

console.log(person.fullName);

console.log(person.getFullName());

//Person 2 example
let person2 = {};
person2.firstName = "Salaheddine";
person2.lastName = "Al-Ayoubi";
person2.age = "20" ;
person2.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
}

console.log(person2.getFullName(), "\n");

//Student Example
let name = "Fahim Mujtahid";
let courses = [
    { courseCode: 'CMPS151', grade: 'A' },
    { courseCode: 'CMPS152', grade: 'B' },
    { courseCode: 'CMPS251', grade: 'B+' },
    { courseCode: 'CMPS356', grade: 'A' }
  ];

let student = {
    name,
    courses,

    display() {
        let msg = `${this.name} \n`;

        for (let course of this.courses) {
            msg += `${course.courseCode} : ${course.grade} \n`;
        }
        console.log(msg);
    }
};

student.display();
courses[2].grade = 'C';
student.display();
