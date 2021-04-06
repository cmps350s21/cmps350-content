import * as AppRepo from '../repo/applications-repo.js'
import * as util from '../repo/general-repo.js' ;


const FName = document.querySelector('#firstName');
const LName = document.querySelector('#lastName') ;
const DOB = document.querySelector('#DoB');
const gender = document.querySelector('#Gender')
const CurrentSchool = document.querySelector('#CurrentSchoolGrade') ;
const ApplyGrade = document.querySelector('#GradeApplyingFor');
const resident = document.querySelector('#Resident');


let app = await AppRepo.getApplication(parseInt(localStorage.getItem('applicationID')))

await view(app)

export async function view(app) {
    FName.value = app.FirstName;
    LName.value = app.LastName;
    DOB.value = app.DateOfBirth;
    gender.value = app.Gender;
    CurrentSchool.value = app.CurrentSchoolGrade;
    ApplyGrade.value = app.GradeApplyingFor;
    resident.value = app.Resident;
}






