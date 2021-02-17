const fs = require('fs-extra');

fs.readFile("data/student2.json")
    .then(content => {
        console.log(JSON.parse(content));
    }).catch(err => {
        console.log(err);
    });

/*
function cb(err, data) {
    if (err) {
        console.log(err);
    } else {
        let students = JSON.parse(data);
        console.log(students);
    }
}

function getStudent(studentId, cb) {
    fs.readFile("data/student.json", (err, data) => {
        if (err) {
            cb(err);
        } else {
            let students = JSON.parse(data);
            let student = students.find(s => s.studentId == studentId);

                getProgram(student.program, function (err, program) {
                    if (err) {
                        cb(err);
                    } else {
                        student.programName = program.name;
                        cb(null, student);
                    }
                });

            //console.log("Inside function:", student);
        }
    });
}

function getProgram(programCode, cb) {
    fs.readFile("data/ceng-programs.json", (err, data) => {
        if (err) {
            cb(err);
        } else {
            let programs = JSON.parse(data);
            let program = programs.find(s => s.code == programCode);
            //console.log("Inside function:", student);
            cb(null, program);
        }
    });
}

getStudent(2015001, function (err, student) {
    if (err) {
        console.log(err);
    } else {
        console.log(student);
    }
});


*/
