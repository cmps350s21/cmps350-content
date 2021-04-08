import * as AdmissionsRepo from '../repository/AdmissionsRepo.js'
import * as AuthRepo from '../repository/AuthRepo.js'

document.addEventListener("DOMContentLoaded", async () => {
    /*
    Because we set type='module' in <script type="module" src="./app.js"></script>
    Attach these functions to the window object to make
    them available to the html page.
    Or use addEventListener to bind handler.
    */
    window.viewAdmission = viewAdmission;
    window.editAdmission = editAdmission;

    window.addNote = addNote;
    window.saveNote = saveNote;
    window.showNotes = showNotes;
    window.deleteNote = deleteNote;
    window.editNote = editNote;

    window.addAttachment = addAttachment;
    window.saveAttachment = saveAttachment;
    window.showAttachments = showAttachments;
    window.deleteAttachment = deleteAttachment;

    window.withdrawAdmission = withdrawAdmission;
    // Admin
    window.opedAdmission = opedAdmission;
    window.filterByYear = filterByYear;
    window.filterByStatus = filterByStatus;
    window.generateSummaryReport = generateSummaryReport;

});
const admissionsTableBody = document.querySelector('#admissions-table-body')
// to be used in add/update notes, attachments,...
let currentAdmission;
// to be used in add attachment (pic)
let imageData;

await getAdmissions()

async function getAdmissions() {
    /*
    1. User email (account) is added as (author) to the new created admission application,
    2. and we keep track of what account is using the website through local storage, by adding the account email after login
    3. then we can get all admissions related to that user only (currentUser), then we fill the table
    4. in case of the currentUser ia the Admin user, then we get all admission applications from the db and display them.
    */

    // This should get all admissions related to the current logged in user only (that stored in a localStorage key)
    const currentUserEmail = await AuthRepo.getCurrentUser()
    const currentUserRole = await AuthRepo.getCurrentRole()

    // Check if there is a current logged in user
    if (currentUserEmail !== undefined && currentUserEmail !== "") {
        if (currentUserRole === "principal") { // This is the admin, so display all admission applications
            const allAdmissions = await AdmissionsRepo.getAllAdmissions()
            setUpAdminTableHeader();
            admissionsTableBody.innerHTML = admissionToHTMlADMIN(allAdmissions);
            document.querySelector('#summary-report-btn').style.display = "block";
        } else {
            console.log("The returned current user: ", currentUserEmail)
            const userAdmissions = await AdmissionsRepo.getUserAdmissions(currentUserEmail)
            console.log("Admission applications returned for the current user: ", userAdmissions)

            // now we should populate the table
            admissionsTableBody.innerHTML = admissionToHTMl(userAdmissions)
            userAdmissions.forEach(ad => ad.testResults.forEach(r => {
                if (r.toNotify) {
                    const confirmed = confirm(`New Test Result [Name: ${r.testName}, Score: ${r.testScore}] have been added on your Admission with id ${ad.id}`);
                    if (confirmed) {
                        r.toNotify = false;
                        AdmissionsRepo.updateAdmission(ad);
                    }
                }
            }));
        }
    } else {
        window.location = "../html/home.html"
    }
}


/** Handel log out **/
const logOutBtn = document.querySelector('.logOut')
logOutBtn.addEventListener('click', logOut)

async function logOut() {
    if (AuthRepo.logOutCurrentUser())
        window.location = "../html/home.html"
}


/** Handel edit account **/
const editUserAccountBtn = document.querySelector('.editUserAccount')
editUserAccountBtn.addEventListener('click', editUserAccount)

async function editUserAccount() {
    const currentUser = await AuthRepo.getCurrentUser()
    if (currentUser !== undefined && currentUser !== '') {
        const currentUserEmail = await AuthRepo.getCurrentUser()
        const currentUser = await AuthRepo.getUserByEmail(currentUserEmail)
        AuthRepo.setUpdateUserId(currentUser.id)
        window.location = "../html/register.html"
    } else
        alert('Please Login First!')
}

/** For normal user (parent) usage **/
function admissionToHTMl(admission) {
    return admission.map(ad => {
        if (ad.status === 'Withdrawn' || ad.status === 'Accepted' || ad.status === 'Declined')
            return ` <tr>
                <td>${ad.s_fname} ${ad.s_lname}</td>
                <td>${ad.creationDate}</td>
                <td>${ad.forAcademicYear}</td>
                <td>${ad.status}</td>
                <td class="actions" colspan="2">
                    <button class="btn action-btn green" onclick="viewAdmission(${ad.id})">View</button>
                </td>
             </tr>`
        else
            return ` <tr>
                <td>${ad.s_fname} ${ad.s_lname}</td>
                <td>${ad.creationDate}</td>
                <td>${ad.forAcademicYear}</td>
                <td>${ad.status}</td>
                <td class="actions">
                    <button class="btn action-btn green" onclick="viewAdmission(${ad.id})">View</button>
                    <button class="btn action-btn" onclick="editAdmission(${ad.id})">Edit</button>
                    <button class="btn action-btn red" onclick="withdrawAdmission(${ad.id})">Withdraw</button>
                </td>
                <td>
                    <select class="filed" multiple>
                        <optgroup label="Notes">
                        <option onclick="addNote(${ad.id})"><button class="btn action-btn">Add Note</button></option>
                        <option onclick="showNotes(${ad.id})"><button class="btn action-btn">Show Notes</button></option>
                        </optgroup>
                    </select>
                    <select class="filed" multiple style="min-height: auto;">
                        <optgroup label="Attachments">
                        <option onclick="addAttachment(${ad.id})"><button class="btn action-btn">Add Attachment</button></option>
                        <option onclick="showAttachments(${ad.id})"><button class="btn action-btn">Show Attachments</button></option>
                        </optgroup>
                    </select>
                </td>
             </tr>`
    }).join('\n')
}


/** Handel view non-editable admission **/
async function viewAdmission(id) {
    const admission = await AdmissionsRepo.getAdmissionById(id);
    const modelInnerTable = document.querySelector('.view-app-model-content');
    modelInnerTable.innerHTML = `
            <tr><td>Student First Name</td><td>${admission.s_fname}</td></tr>
            <tr><td>Student Last Name</td><td>${admission.s_lname}</td></tr>
            <tr><td>Student Gender</td><td>${admission.s_gender}</td></tr>
            <tr><td>Student Date of Birth</td><td>${admission.s_DOB}</td></tr>
            <tr><td>Student Current School Name</td><td>${admission.s_current_school_name}</td></tr>
            <tr><td>Student Current School Grade</td><td>${admission.s_current_school_grade}</td></tr>
            <tr><td>Student Apply to School Grade</td><td>${admission.s_apply_school_grade}</td></tr>
            <tr><td>Application for Academic Year</td><td>${admission.forAcademicYear}</td></tr>
            <tr><td>Application Status</td><td>${admission.status}</td></tr>
            <tr><td>Application Messages</td><td>${admission.s_message}</td></tr>`;
    const admissionModel = document.querySelector('.admission-model');
    admissionModel.style.display = "block";
}


/** Handel edit admission **/
async function editAdmission(id) {
    if (id) { // valid id
        AdmissionsRepo.setUpdateAdmissionId(id);
        window.location = "../html/admission.html"
    }
}


/** Handel add note for admission application **/
async function addNote(id) {
    currentAdmission = await AdmissionsRepo.getAdmissionById(id);
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
async function showNotes(id) {
    currentAdmission = await AdmissionsRepo.getAdmissionById(id);
    if (currentAdmission.notes.length != 0) {
        const editDeleteNotesModel = document.querySelector('.edit-delete-notes-model');
        editDeleteNotesModel.style.display = "block";
        const notesList = document.querySelector('.notes-list');
        notesList.innerHTML = currentAdmission.notes.map((n, index) => {
            return `<tr>
                    <td style="padding: 10px 20px;"><textarea class="filed" id="edited-note">${n}</textarea></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn green" onclick="editNote(${index})">Update</button></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn red" onclick="deleteNote(${index})">Delete</button></td>
                </tr>`
        }).join('\n');
    } else
        alert('There are no notes to be edited!')
}

async function deleteNote(index) {
    currentAdmission.notes.splice(index, 1);
    await AdmissionsRepo.updateAdmission(currentAdmission);
    location.reload();
}

async function editNote(index) {
    currentAdmission.notes[index] = document.querySelector('#edited-note').value;
    await AdmissionsRepo.updateAdmission(currentAdmission);
    location.reload();
}


/** Handel add attachment for admission application **/
async function addAttachment(id) {
    currentAdmission = await AdmissionsRepo.getAdmissionById(id);
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
async function showAttachments(id) {
    currentAdmission = await AdmissionsRepo.getAdmissionById(id);
    if (currentAdmission.attachments.length != 0) {
        const editDeleteAttachmentsModel = document.querySelector('.edit-delete-attachments-model');
        editDeleteAttachmentsModel.style.display = "block";
        const attachmentsList = document.querySelector('.attachments-list');
        attachmentsList.innerHTML = currentAdmission.attachments.map((att, index) => {
            return `<tr>
                    <td style="padding: 10px 20px;"><img class="filed" src="${att}" style="max-height: 200px" alt="Image"/></td>
                    <td style="padding: 10px 20px;"><button class="btn action-btn red" onclick="deleteAttachment(${index})">Delete</button></td>
                </tr>`
        }).join('\n');
    } else
        alert('There are no attachments to be edited!')
}

async function deleteAttachment(index) {
    currentAdmission.attachments.splice(index, 1);
    await AdmissionsRepo.updateAdmission(currentAdmission);
    location.reload();
}


/** Handel withdraw admission **/
async function withdrawAdmission(id) {
    const confirmed = confirm(`Are you sure you want to withdraw Application #${id}?`);
    if (confirmed) {
        await AdmissionsRepo.withdrawAdmission(id)
        alert(`Application with id: ${id} has been withdrawn`);
        await getAdmissions()
    }
}


/** For Admin user usage **/
async function setUpAdminTableHeader() {
    // configure special table header for the admin
    const academicYears = await AdmissionsRepo.getAllAcademicYears();
    const applicationStatuses = await AdmissionsRepo.getAllApplicationStatuses();
    const yearsHTML = academicYears.map(y => `<option value="${y.year}">${y.year}</option>`).join('\n');
    const statusesHTML = applicationStatuses.map(s => `<option value="${s.name}">${s.name}</option>`).join('\n');
    document.querySelector('#admissions-table-head').innerHTML = `<thead>
        <tr>
            <th>Application for</th>
            <th>Date Created</th>
            <th>Academic Year <select id="academicYearFilter" onchange="filterByYear(this.value)">
                <option value="All">All</option>
                ${yearsHTML}
            </select></th>
            <th>Status <select id="statusFilter" onchange="filterByStatus(this.value)">
                <option value="All">All</option>
                ${statusesHTML}
            </select></th>
            <th colspan="2">Action</th>
        </tr>
    </thead>`;
}

function admissionToHTMlADMIN(admission) {
    return admission.map(ad => {
        return ` <tr>
                <td>${ad.s_fname} ${ad.s_lname}</td>
                <td>${ad.creationDate}</td>
                <td>${ad.forAcademicYear}</td>
                <td>${ad.status}</td>
                <td class="actions" colspan="2">
                    <button class="btn action-btn" onclick="editAdmission(${ad.id})">Edit</button>
                    <button class="btn action-btn green" onclick="opedAdmission(${ad.id})">Open</button>
                </td>
             </tr>`
    }).join('\n')
}

async function filterByYear(value) {
    let filteredAdmissions = await AdmissionsRepo.getAllAdmissions();
    if (value !== 'All')
        filteredAdmissions = filteredAdmissions.filter(ad => ad.forAcademicYear == value);
    admissionsTableBody.innerHTML = admissionToHTMlADMIN(filteredAdmissions);
}

async function filterByStatus(value) {
    let filteredAdmissions = await AdmissionsRepo.getAllAdmissions();
    if (value !== 'All')
        filteredAdmissions = filteredAdmissions.filter(ad => ad.status == value);
    admissionsTableBody.innerHTML = admissionToHTMlADMIN(filteredAdmissions);
}

async function opedAdmission(id) {
    AuthRepo.setUpdateUserId(id);
    window.location = "../html/principal-application-view.html"
}

async function generateSummaryReport() {
    const allApplications = await AdmissionsRepo.getAllAdmissions();
    const academicYears = await AdmissionsRepo.getAllAcademicYears();
    const reportForYear = academicYears.map(y => {
            let allApplicationsForYear = allApplications.filter(app => app.forAcademicYear == y.year);
            let gradeCount = Array(12).fill(0); // Means apply for grade (index), there was gradeCount[index] application
            allApplicationsForYear.forEach(app => gradeCount[parseInt(app.s_apply_school_grade)]++)
            let sampleReport = `<tr></tr><td>For Year: ${y.year}</td>`;
            gradeCount.forEach((applications, grade) => {
                if (applications != 0)
                    sampleReport += `<td>Grade ${grade} had ${applications} Admission Applications</td>`
            })
            sampleReport += `</tr>`
            return sampleReport;
        }
    )
    const reportModel = document.querySelector('.report-model');
    const modelInnerTable = document.querySelector('.report-model-content');
    modelInnerTable.innerHTML = reportForYear
    reportModel.style.display = "block";
}

/** Handel Close All Models */
const allModels = document.getElementsByClassName('model');
for (let model of allModels) {
    const modelCloseBtn = document.querySelector(`#${model.id} .close`)
    modelCloseBtn.onclick = function () {
        model.style.display = "none";
    }
}
