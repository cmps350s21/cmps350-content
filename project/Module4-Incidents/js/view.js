import * as incidentRepository from './incidentRepository.js';
import * as userRepository from './userRepository.js';

const studentsInvolved = document.querySelector('.generatedStudent')
const typeDetails = document.querySelector('#typeDetails')
const locationDetails = document.querySelector('#locationDetails')
const dateDetails = document.querySelector('#dateDetails')
const timeDetails = document.querySelector('#timeDetails')
const teachersInvolved = document.querySelector('#teacherNames')
const incidentRemarks = document.querySelector('#remarks')
const notes = document.querySelector('#note')
const penalties = document.querySelector('#penalty')
const attachments = document.querySelector('#attachment')

window.displayIncident = displayIncident

displayIncident()

async function displayIncident() {
    let incidentId = JSON.parse(localStorage.getItem('incidentIds'))
    const incidentData = await incidentRepository.getIncident(incidentId)

    let students = await incidentData.student
    studentsInvolved.innerHTML = students.map(s => userRepository.studentToHTML(s)).join('')
    typeDetails.innerHTML = `<b>Incident Type:</b> <p>${incidentData.type[1]}</p>`
    locationDetails.innerHTML = `<b>Incident Location:</b> <p>${incidentData.location[1]}</p>`
    dateDetails.innerHTML = `<b>Incident Date:</b> <p>${incidentData.date}</p>`
    timeDetails.innerHTML = `<b>Incident Time:</b> <p>${incidentData.time}</p>`

    let teachers = await incidentData.teacher
    teachersInvolved.innerHTML = teachers.map(t => `<li>${t}</li>`)
    incidentRemarks.innerHTML = `<p><b>Teacher's comments:</b> ${incidentData.remarks}</p>`
    if (incidentData.note) {
        notes.innerHTML = `
        <p><b>Notes:</b> ${incidentData.note}</p>`
    } else {
        notes.innerHTML =
            `<p><b>Notes:</b> None</p>`
    }
    if (incidentData.attachment) {
        attachments.innerHTML = `
        <p><b>Attachments:</b><img src="${incidentData.attachment}" alt="Attachment"></p>`
    } else {
        attachments.innerHTML =
            `<p><b>Attachments:</b> None</p>`
    }
    if (incidentData.penalty) {
        penalties.innerHTML = `
        <p><b>Penalty:</b> ${incidentData.penalty[1]}</p>`
    } else {
        penalties.innerHTML =
            `<p><b>Penalty:</b> None</p>`
    }
}