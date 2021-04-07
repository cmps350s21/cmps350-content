import * as incidentRepository from './incidentRepository.js';

const summaryTable = document.querySelector('.summaryTable')
const filterForm = document.querySelector('.filterForm')
const startDate = document.querySelector('#fromDate')
const endDate = document.querySelector('#toDate')
const gradeSelect = document.querySelector('#grade-options')

window.openGet = openGet;

filterForm.addEventListener('submit', getSummary)
startDate.value = new Date().toISOString().substring(0, 10)
endDate.value = new Date().toISOString().substring(0, 10)

async function getSummary(event) {
    event.preventDefault()
    let start = startDate.value
    let end = endDate.value
    let grade = gradeSelect.value
    let incidents = []
    const incidentsData = await incidentRepository.getIncidents()
    let matches = incidentsData
    if (start > end) {
        alert("To Date Should Be Bigger Than From Date PLEASE SELECT A VALID RANGE")
    } else {
        if (grade != 0) {
            matches = incidentsData.filter(i => i.student.some(s => s.grade == grade))
        }
        incidents = matches.filter(s => s.date <= end && s.date >= start)
        summaryTable.innerHTML = summaryIncidentsToHTMLRow(incidents)
    }
}

async function openGet(incidents, type) {
    let incidentIds = incidents.split(',')
    if (incidents) {
        localStorage.setItem('summaryIncident', JSON.stringify(incidentIds))
        localStorage.setItem('summaryType', JSON.stringify(type))
        window.location.href = 'getIncident.html'
    }
}

function summaryIncidentsToHTMLRow(incidents) {
    return `
    <tr>
         <td style="text-decoration: underline" onclick="openGet('${incidents.map((inc) => inc.id)}',0)">Damaging school property</td>
         <td>${incidents.filter((inc) => inc.type[0] == 0).length}</td>
    </tr>
    <tr>
        <td style="text-decoration: underline" onclick="openGet('${incidents.map((inc) => inc.id)}',1)">Cheating</td>
        <td>${incidents.filter((inc) => inc.type[0] == 1).length}</td>
    </tr>
    <tr>
        <td style="text-decoration: underline" onclick="openGet('${incidents.map((inc) => inc.id)}',2)">Bullying</td>
        <td>${incidents.filter((inc) => inc.type[0] == 2).length}</td>
    </tr>
    <tr>
        <td style="text-decoration: underline" onclick="openGet('${incidents.map((inc) => inc.id)}',3)">Threat of physical violence</td>
        <td>${incidents.filter((inc) => inc.type[0] == 3).length}</td>
    </tr>
    <tr>
        <td style="text-decoration: underline" onclick="openGet('${incidents.map((inc) => inc.id)}',4)">Actual physical violence</td>
        <td>${incidents.filter((inc) => inc.type[0] == 4).length}</td>
    </tr>
    <tr>
         <td style="text-decoration: underline" onclick="openGet('${incidents.map((inc) => inc.id)}',5)">Other</td>
         <td>${incidents.filter((inc) => inc.type[0] == 5).length}</td>
    </tr>
    `
}