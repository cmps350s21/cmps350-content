import * as incidentRepository from './incidentRepository.js';

const attachModal = document.querySelector('#attachContainer')
const attachForm = document.querySelector('.attachForm')
const attachBtn = document.querySelector('#attachment')
const attachImage = document.querySelector('#attachedImage')
const deleteImg = document.querySelector('#removeImg')
const noteModal = document.querySelector('#noteContainer')
const noteForm = document.querySelector('.noteForm')
const noteContents = document.querySelector('#noteArea')
const penaltyModal = document.querySelector('#penaltyContainer')
const penaltyForm = document.querySelector('.penaltyForm')
const penaltySelect = document.querySelector('#penaltySelect')
const incidentsTable = document.querySelector('.incidentReports')
const searchbar = document.querySelector('#search-bar')
const filterbutton = document.querySelector('#filter-search')

window.deleteAndDisplayIncident = deleteAndDisplayIncident;
window.openAttachment = openAttachment;
window.closeAttachment = closeAttachment;
window.deleteAttach = deleteAttach
window.closeNote = closeNote;
window.openNote = openNote;
window.openUpdate = openUpdate;
window.closePenalty = closePenalty;
window.openPenalty = openPenalty;
window.openView = openView;

attachBtn.addEventListener('change', loadImage)
attachForm.addEventListener('submit', saveAttachment)
noteForm.addEventListener('submit', saveNote)
penaltyForm.addEventListener('submit', savePenalty)
searchbar.addEventListener("keyup", searchStudent)
filterbutton.preventDefault;
filterbutton.addEventListener("click", searchByDate)

let incidentId = ''
const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))

if (!loggedUser.children) {
    getIncidents()
} else if (loggedUser.children) {
    let students = JSON.parse(localStorage.getItem('loggedUser')).children
    getParentIncidents(students)
}

async function getIncidents() {
    if (!localStorage.getItem('summaryType')) {
        const incidentsData = await incidentRepository.getIncidents()
        const incidentsRows = incidentsData.map(inc => incidentsToHTMLRow(inc))
        incidentsTable.innerHTML = `
        ${incidentsRows.join('')}
    `
    } else {
        let incidentIds = JSON.parse(localStorage.getItem('summaryIncident'))
        let type = JSON.parse(localStorage.getItem('summaryType'))
        let incident = []
        for (let id of incidentIds) {
            incident.push(await incidentRepository.getIncident(id))
        }
        incident = incident.filter((inc) => inc.type[0] == type)
        const incidentsRows = incident.map(inc => incidentsToHTMLRow(inc))
        incidentsTable.innerHTML = `
        ${incidentsRows.join('')}
        `
        localStorage.removeItem('summaryIncident')
        localStorage.removeItem('summaryType')
    }
}

async function getParentIncidents(students) {
    const incidentsData = await incidentRepository.getIncidents()
    let uniqueIncidentsInvolved = new Set()
    let incidents = []
    let matches = []
    let incidentIds = []
    for (let incident of incidentsData) {
        matches = students.filter(s => incident.student.some(s2 => s.id == s2.id))
        if (matches.length > 0) {
            uniqueIncidentsInvolved.add(incident.id)
        }
    }
    incidentIds = [...uniqueIncidentsInvolved]
    for (let id of incidentIds) {
        incidents.push(await incidentRepository.getIncident(id))
    }
    incidentsTable.innerHTML = incidents.map(i => incidentsToHTMLRow(i)).join('')

    const buttons = document.querySelectorAll('#getUpdate,#getNote,#getAttach,#getPenalty,#getDelete')
    for (let button of buttons) {
        button.style.display = 'none'
    }

}

async function deleteAndDisplayIncident(incidentId) {
    await incidentRepository.deleteIncident(incidentId)
    getIncidents()
}

async function openAttachment(incId) {
    attachModal.style.display = 'block'
    incidentId = incId
    const incident = await incidentRepository.getIncident(incId)
    attachImage.src = incident.attachment;
    if (incident.attachment) {
        deleteImg.style.display = ''
    } else {
        deleteImg.style.display = 'none'
    }
}

function closeAttachment() {
    attachModal.style.display = 'none'
    attachForm.reset()
}

function loadImage() {
    const fr = new FileReader();
    fr.addEventListener("load", () => {
        const imageData = fr.result;
        localStorage.attachment = imageData;
        attachImage.src = imageData;
    });
    fr.readAsDataURL(this.files[0]);
}

function saveAttachment(event) {
    event.preventDefault()
    const imageData = localStorage.attachment;
    incidentRepository.updateIncident(incidentId, {
        attachment: imageData
    })
    closeAttachment()
    deleteImg.style.display = ''
    localStorage.removeItem('attachment')
}

function deleteAttach() {
    incidentRepository.updateIncident(incidentId, {
        attachment: ''
    })
    attachImage.src = ''
    deleteImg.style.display = 'none'
}

async function openNote(incId) {
    noteModal.style.display = 'block'
    incidentId = incId
    const incident = await incidentRepository.getIncident(incId)
    noteContents.value = incident.note
}

function closeNote() {
    noteModal.style.display = 'none'
    noteForm.reset()
}

function saveNote(event) {
    event.preventDefault()
    incidentRepository.updateIncident(incidentId, {
        note: noteContents.value
    })
    closeNote()
}

async function openPenalty(incId) {
    penaltyModal.style.display = 'block'
    incidentId = incId
    const incident = await incidentRepository.getIncident(incId)
    penaltySelect.options[incident.penalty[0]].selected = true
}

function closePenalty() {
    penaltyModal.style.display = 'none'
    penaltyForm.reset()
}

function savePenalty(event) {
    event.preventDefault()
    incidentRepository.updateIncident(incidentId, {
        penalty: [penaltySelect.value, penaltySelect.options[penaltySelect.value].id]
    })
    closePenalty()
}

function openView(incidentId) {
    localStorage.setItem('incidentIds', JSON.stringify(incidentId))
    window.location.href = 'view.html'
}

function openUpdate(incidentId) {
    localStorage.setItem('incidentIds', JSON.stringify(incidentId))
    window.location.href = 'update.html'
}

function incidentsToHTMLRow(inc) {
    return `
    <tr>
         <td>${inc.id}</td>
         <td>${inc.student.map(s => `${s.name} (${(s.grade)})`)}</td> 
         <td>${inc.type[1]}</td> 
         <td>${inc.date}</td>
         <td>${inc.time}</td> 
         <td>${inc.location[1]}</td> 
         <td>
            <button type="button" title="View Incident" id="getView" class="fa fa-eye" onclick="openView('${inc.id}')"></button>
            <button type="button" title="Update Incident" id="getUpdate" class="fa fa-plus-square-o" onclick="openUpdate('${inc.id}')"></button>
            <button type="button" title="Add Note" id="getNote" class="fa fa-pencil" onclick="openNote('${inc.id}')"></button>
            <button type="button" title="Attach File" id="getAttach" class="fa fa-paperclip" onclick="openAttachment('${inc.id}')"></button>  
            <button type="button" title="Add Penalty" id="getPenalty" class="fa fa-money" onclick="openPenalty('${inc.id}')"></button>  
            <button type="button" title="Delete Incident" id="getDelete" class="fa fa-trash" onclick="deleteAndDisplayIncident('${inc.id}')"></button>
       </td>
    </tr>
    `
}

function searchStudent() {
    let filter, row, column, i;
    filter = searchbar.value.toUpperCase();
    row = incidentsTable.querySelectorAll("tr");
    for (i = 0; i < row.length; i++) {
        column = row[i].querySelectorAll("td")[1];
        if (column) {
            if (column.innerHTML.toUpperCase().indexOf(filter) > -1) {
                row[i].style.display = "";
            } else {
                row[i].style.display = "none";
            }
        }
    }
}

async function searchByDate() {
    let start, end;
    const incidentsData = await incidentRepository.getIncidents()
    let matches = []
    const fromdate = document.querySelector('#startdate')
    const todate = document.querySelector('#enddate')
    start = fromdate.value;
    end = todate.value;
    if (start > end) {
        alert("To Date Should Be Bigger Than From Date PLEASE SELECT A VALID RANGE")
    } else {
        matches = incidentsData.filter(s => s.date <= end && s.date >= start)
        incidentsTable.innerHTML = matches.map(i => incidentsToHTMLRow(i)).join('')
        if (matches.length === 0) {
            getIncidents()
            alert("No Incidents Fond in the Selected Range Please Try Another Date Range ")
        }

    }
}


