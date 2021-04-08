import * as AuthRepo from '../repository/AuthRepo.js'
import * as AdmissionsRepo from '../repository/AdmissionsRepo.js'

document.addEventListener("DOMContentLoaded", async () => {
    /*
    Because we set type='module' in <script type="module" src="./app.js"></script>
    Attach these functions to the window object to make
    them available to the html page.
    Or use addEventListener to bind handler.
    */
    window.addNoteModel = addNoteModel;
    window.saveNote = saveNote;

    window.showNotesModel = showNotesModel;
    window.deleteNote = deleteNote;
    window.editNote = editNote;

    window.addAttachmentModel = addAttachmentModel;
    window.saveAttachment = saveAttachment;
    window.showAttachmentsModel = showAttachmentsModel;
    window.deleteAttachment = deleteAttachment;

    window.changeAdmissionStatusModel = changeAdmissionStatusModel;
    window.updateStatus = updateStatus;

    window.testResultModel = testResultModel;
    window.saveTest = saveTest;

});

const admissionId = parseInt(AuthRepo.getUpdateUserId());
const currentAdmission = await AdmissionsRepo.getAdmissionById(admissionId);
let imageData;

const admissionModel = document.querySelector('.view-app-content');
let viewAdmissionTable = `
            <tr><td>Student First Name</td><td>${currentAdmission.s_fname}</td></tr>
            <tr><td>Student Last Name</td><td>${currentAdmission.s_lname}</td></tr>
            <tr><td>Student Gender</td><td>${currentAdmission.s_gender}</td></tr>
            <tr><td>Student Date of Birth</td><td>${currentAdmission.s_DOB}</td></tr>
            <tr><td>Student Current School Name</td><td>${currentAdmission.s_current_school_name}</td></tr>
            <tr><td>Student Current School Grade</td><td>${currentAdmission.s_current_school_grade}</td></tr>
            <tr><td>Student Apply to School Grade</td><td>${currentAdmission.s_apply_school_grade}</td></tr>
            <tr><td>Application for Academic Year</td><td>${currentAdmission.forAcademicYear}</td></tr>
            <tr><td>Application Status</td><td>${currentAdmission.status}</td></tr>
            <tr><td>Application Messages</td><td>${currentAdmission.s_message}</td></tr>`;
admissionModel.innerHTML = viewAdmissionTable;


/** Handel Change (update) Application status by the Admin */
async function changeAdmissionStatusModel() {
    const changeStatusModelContent = document.querySelector('.change-status-model-content');
    const applicationStatuses = await AdmissionsRepo.getAllApplicationStatuses();
    changeStatusModelContent.innerHTML = applicationStatuses.map(s =>
        `<input type="radio" id="${s.name}" name="status" value="${s.name}">&nbsp;<label for="${s.name}">${s.name}</label><br>`).join('\n');
    const changeStatusModel = document.querySelector('.change-status-model');
    changeStatusModel.style.display = "block";
}

async function updateStatus() {
    const statusRadios = document.getElementsByName('status');
    let status;
    for (let i = 0, length = statusRadios.length; i < length; i++) {
        if (statusRadios[i].checked) {
            status = statusRadios[i].value;
            break;
        }
    }
    if (status)
        currentAdmission.status = status;
    await AdmissionsRepo.updateAdmission(currentAdmission);
    location.reload();
}


/** Handel add note for admission application **/
async function addNoteModel() {
    const noteModel = document.querySelector('.note-model');
    noteModel.style.display = "block";
}

async function saveNote() {
    const note = document.querySelector('#note').value;
    currentAdmission.notes.push(note);
    console.log(currentAdmission.notes);
    console.log(currentAdmission);
    await AdmissionsRepo.updateAdmission(currentAdmission);
    location.reload();
}


/** Handel list, edit notes for admission application */
async function showNotesModel() {
    if (currentAdmission.notes.length != 0) {
        const editDeleteNotesModel = document.querySelector('.edit-delete-notes-model');
        editDeleteNotesModel.style.display = "block";
        const notesList = document.querySelector('.notes-list');
        const notesListHTML = currentAdmission.notes.map((n, index) => {
            return `<tr>
                    <td style="padding: 10px 20px;"><textarea class="filed" id="edited-note">${n}</textarea></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn green" onclick="editNote(${index})">Update</button></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn red" onclick="deleteNote(${index})">Delete</button></td>
                </tr>`
        }).join('\n');
        notesList.innerHTML = notesListHTML;
    } else
        alert('There are no notes to be edited!')
}

async function deleteNote(index) {
    currentAdmission.notes.splice(index, 1);
    await AdmissionsRepo.updateAdmission(currentAdmission);
    location.reload();
}

async function editNote(index) {
    const editedNote = document.querySelector('#edited-note').value;
    currentAdmission.notes[index] = editedNote;
    await AdmissionsRepo.updateAdmission(currentAdmission);
    location.reload();
}


/** Handel add attachment for admission application **/
async function addAttachmentModel() {
    const attachmentModel = document.querySelector('.attachment-model');
    attachmentModel.style.display = "block";
    document.querySelector("#attachment").addEventListener("change", function () {
        const fileReader = new FileReader();
        //Once the file is read store its content in the localStorage
        fileReader.addEventListener("load", () => {
            imageData = fileReader.result;
            console.log(imageData);
            document.querySelector("#attachment-image").src = imageData;
        });
        // Read the selected file as text
        fileReader.readAsDataURL(this.files[0]);
    });
}

async function saveAttachment() {
    currentAdmission.attachments.push(imageData);
    await AdmissionsRepo.updateAdmission(currentAdmission);
    location.reload();
}


/** Handel list, edit attachments for admission application */
async function showAttachmentsModel() {
    if (currentAdmission.attachments.length != 0) {
        const editDeleteAttachmentsModel = document.querySelector('.edit-delete-attachments-model');
        editDeleteAttachmentsModel.style.display = "block";
        const attachmentsList = document.querySelector('.attachments-list');
        const attachmentsListHTML = currentAdmission.attachments.map((att, index) => {
            return `<tr>
                    <td style="padding: 10px 20px;"><img class="filed" src="${att}" style="max-height: 200px"/></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn red" onclick="deleteAttachment(${index})">Delete</button></td>
                </tr>`
        }).join('\n');
        attachmentsList.innerHTML = attachmentsListHTML;
    } else
        alert('There are no attachments to be edited!')
}

async function deleteAttachment(index) {
    currentAdmission.attachments.splice(index, 1);
    await AdmissionsRepo.updateAdmission(currentAdmission);
    location.reload();
}


/** Handel add test grade */
async function testResultModel() {
    const testModel = document.querySelector('.test-result-model');
    testModel.style.display = "block";
}

async function saveTest() {
    const testName = document.querySelector('#test').value;
    const testScore = document.querySelector('#score').value;
    let testObject = {testName, testScore, toNotify: true};
    currentAdmission.testResults.push(testObject);
    await AdmissionsRepo.updateAdmission(currentAdmission);
    location.reload();
}


/** Handel Close All Models */
const allModels = document.getElementsByClassName('model');
for (let model of allModels) {
    const modelCloseBtn = document.querySelector(`#${model.id} .close`)
    modelCloseBtn.onclick = function () {
        model.style.display = "none";
    }
}
