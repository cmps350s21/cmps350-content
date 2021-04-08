import * as AdmissionsRepo from '../repository/AdmissionsRepo.js';
import * as AuthRepo from '../repository/AuthRepo.js';

const admissionForm = document.querySelector('#admission_form');
admissionForm.addEventListener('submit', submitAdmissionApplication);

let isEditing = false;

// To check if editing mode, then populate the admission object to the form
const id = parseInt(AdmissionsRepo.getUpdateAdmissionId());
let admission;
if (id) {
    admission = await AdmissionsRepo.getAdmissionById(id);
    console.log("Admission to be updated:", admission);
    // Convert JSON object to Form
    FormDataJson.fillFormFromJsonValues(admissionForm, admission);
    isEditing = true;
}

async function submitAdmissionApplication(event) {
    if (!admissionForm.checkValidity()) return
    // Prevent default action of the submit button
    event.preventDefault()

    // Start do what i want to happen on submit clicked
    const newApplication = formToObject(admissionForm);
    if (isEditing) {
        // those data ware not in the form, so i have to add them again
        newApplication.id = id;
        newApplication.author = admission.author;
        newApplication.status = admission.status;
        newApplication.creationDate = admission.creationDate;
        newApplication.forAcademicYear = admission.forAcademicYear;
        newApplication.notes = admission.notes;
        newApplication.attachments = admission.attachments;
        newApplication.testResults = admission.testResults;

        const response = await AdmissionsRepo.updateAdmission(newApplication)
        alert(`Admission with id: ${response} is updated`)
        AdmissionsRepo.removeUpdateAdmissionId();
        admissionForm.reset()
    } else {
        newApplication.author = AuthRepo.getCurrentUser();
        newApplication.status = "Submitted";
        newApplication.creationDate = new Date().toLocaleDateString("en-US");
        newApplication.forAcademicYear = await AdmissionsRepo.getOpenForAdmissionYear();
        newApplication.notes = [];
        newApplication.attachments = [];
        newApplication.testResults = [];
        const response = await AdmissionsRepo.addAdmission(newApplication)
        alert(`Admission is added with id: ${response}`)
        admissionForm.reset()
    }
    window.location = "../html/user-home.html"
}

function formToObject(formElement) {
    const formData = new FormData(formElement);
    const data = {}
    for (const [key, value] of formData) {
        data[key] = value;
    }
    return data;
}
