import fs from 'fs-extra';
import fetch from "node-fetch";

let fetchProgram = () => {
    let url = "https://cmps356s19.github.io/data/ceng-programs.json";
    return fetch(url).then(response => response.json());
}

let readProgram = () => {
    return fs.readJson('data/cas-programs.json');
}

Promise.all([fetchProgram(), readProgram()]).then( programs => {
    //Flatten the array
    programs = programs.flat();
    console.log("\nPromise.all - QU Programs (CENG and CAS): ");
    console.log(programs);
});

Promise.race([fetchProgram(), readProgram()]).then( programs => {
    console.log("Promise.race - Results from race of getting CAS or CENG programs: ");
    console.log(programs);
});