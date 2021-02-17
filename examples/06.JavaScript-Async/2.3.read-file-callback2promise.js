// Important traditional fs library to read/write files using callbacks
const fs = require('fs');

/* Now let's make  a function named getStudent to return the details by studentId
 Because getStudent calls a async function itself becomes an async function
*/
function getStudent(studentId) {
    return new Promise( (resolve, reject) => {
        fs.readFile('data/student.json', function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    const students = JSON.parse(data);
                    const student = students.find(s => s.studentId === studentId);
                    resolve(student);
                }
            }
        );
    });
}

function getProgamName(programCode) {
    return new Promise( (resolve, reject) => {
        fs.readFile('data/ceng-programs.json', function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    const programs = JSON.parse(data);
                    const programName = programs.find(p => p.code === programCode).name;
                    resolve(programName);
                }
            }
        );
    });
}

const studentId = 2015009;
let student;
getStudent(studentId).then( aStudent => {
    student = aStudent;
    console.log("\nStudent ", student);
    return getProgamName(student.program);
}).then( progamName => {
    console.log("\nProgram Name: ", progamName);
    student.program += ` - ${progamName}`;
    console.log("\nStudent with a full program name: ", student);
}).catch (err => {
    console.log(err);
});