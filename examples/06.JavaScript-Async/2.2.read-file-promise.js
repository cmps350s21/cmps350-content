// Important traditional fs library to read/write files using callbacks
const fs = require('fs-extra');

/* Now let's make  a function named getStudent to return the details by studentId
 Because getStudent calls a async function itself becomes an async function
*/
function getStudent(studentId) {
    return fs.readJson('data/student.json').then(students => {
        return students.find(s => s.studentId === studentId);
    });
}

function getProgamName(programCode) {
    return fs.readJson('data/ceng-programs.json').then( programs => {
        return programs.find(p => p.code === programCode).name;
    });
}

const studentId = 2015009;
let student;
// This is an example Promises Chaining
getStudent(studentId).then( aStudent => {
    student = aStudent;
    console.log("\nStudent ", student);
    return getProgamName(student.program);
}).then( programName => {
    console.log("\nProgram Name: ", programName);
    student.program += ` - ${programName}`;
    console.log("\nStudent with a full program name: ", student);
}).catch (err => {
    console.log(err);
});