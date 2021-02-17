const fs = require('fs')

let sum = add(10, 20);
let avg = sum / 2;

fs.readFile('data/student.json', function (err, content) {
    if (err) {
        console.log(err);
    } else {
        let students = JSON.parse(content);

        getProgram(students[0].program, function(err, program) {
            students[0].programName = program
            console.log("program", students);
        });

    }
});

function getProgram(programCode, cb) {
    fs.readFile('data/ceng-programs.json', function (err, data) {
        if (err) {
            cb(err);
        } else {
            const programs = JSON.parse(data);
            const program = programs.find( p => p.code == programCode);
            cb(null, program.name);
        }
    });
}