import * as AppRepo from '../repo/applications-repo.js'
import * as util from '../repo/general-repo.js';

const FName = document.querySelector('#firstName');
const LName = document.querySelector('#lastName') ;
const DOB = document.querySelector('#DoB');
const genderR = document.querySelector('input[class=gender]')
const CurrentSchool = document.querySelector('#CurrentSchoolGrade') ;
const ApplyGrade = document.querySelector('#GradeApplyingFor');
const residentR = document.querySelector('input[class=resident]');
const SubmitBtn = document.querySelector('#submit');

let app = await AppRepo.getApplication(parseInt(localStorage.getItem('applicationID')))
view(app)

SubmitBtn.addEventListener('click', saveApplication );

function view(app) {
    FName.value = app.FirstName;
    LName.value = app.LastName;
    DOB.value = app.DateOfBirth;
    genderR.checked = app.Gender;
    CurrentSchool.value = app.CurrentSchoolGrade;
    ApplyGrade.value = app.GradeApplyingFor;
    residentR.checked = app.Resident
}

async function saveApplication(event){
    // make sure all inputs are filled
    const form = event.target.form;
    const isFormValid = form.checkValidity();
    if(!isFormValid) return;

    event.preventDefault();

    let gender = (genderR.checked == true) ? "Male":"Female"
    let resident = (residentR.checked == true) ? "Yes":"No"

    app.FirstName = FName.value
    app.LastName = LName.value
    app.DateOfBirth = DOB.value
    app.Gender = gender
    app.CurrentSchool = CurrentSchool.value
    app.GradeApplyingFor = ApplyGrade.value
    app.Resident = resident
    await AppRepo.updateApplication(app)
    util.goMain()
}
localStorage.removeItem('applicationID')