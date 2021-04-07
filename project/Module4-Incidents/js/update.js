import * as incidentRepository from './incidentRepository.js';
import * as userRepository from './userRepository.js';

const studentsInvolved = document.querySelector('.generatedStudent')
const idBox = document.querySelector('#id')
const incidentType = document.querySelector('#type')
const incidentLocation = document.querySelector('#location')
const incidentDate = document.querySelector('#date')
const incidentTime = document.querySelector('#time')
const teachersInvolved = document.querySelector('#teacher')
const incidentRemarks = document.querySelector('#remarks')
const formElement = document.querySelector('.updateForm')

window.addStudent = addStudent;
window.removeStudent = removeStudent;

let incidentId = JSON.parse(localStorage.getItem('incidentIds'))
let students = []

incidentLocation.innerHTML=await incidentRepository.getLocations()
incidentType.innerHTML=await incidentRepository.getTypes()
formElement.addEventListener('submit', submitChanges)
displayIncident()

async function displayIncident() {
    const incidentData = await incidentRepository.getIncident(incidentId)
    const teacherData = await userRepository.getTeachers()
    teachersInvolved.innerHTML = teacherData.map(t => `<option value="${t.name}">${t.name}</option>`).join('')
    students = await incidentData.student
    showStudents()
    incidentType.options[incidentData.type[0]].selected = true
    incidentLocation.options[incidentData.location[0]].selected = true
    incidentDate.value = incidentData.date
    incidentTime.value = incidentData.time
    let teachers = incidentData.teacher
    for (let i = 0; i < teachersInvolved.options.length; i++) {
        teachersInvolved.options[i].selected = teachers.indexOf(teachersInvolved.options[i].value) >= 0;
    }
    incidentRemarks.value = incidentData.remarks
}

function removeStudent(studentID) {
    students = students.filter(s => s.id != studentID)
    showStudents()
}

async function addStudent() {
    const allStudents = await userRepository.getStudents()
    let newStudent = allStudents.filter(s => s.id == idBox.value)
    let found = false
    for (let s of students) {
        if (idBox.value == s.id) {
            found = true
        }
    }
    if (!found)
        students.push(newStudent[0])
    showStudents()
}

async function submitChanges(event) {
    event.preventDefault()
    const formObject = incidentRepository.form2Object(formElement)
    let index = formObject.location
    formObject.location = [index, incidentLocation.options[index].id]
    index = formObject.type
    formObject.type = [index, incidentType.options[index].id]
    await incidentRepository.overWriteIncident(incidentId, {
        id: incidentId,
        date: formObject.date,
        location: formObject.location,
        time: formObject.time,
        type: formObject.type,
        remarks: formObject.remarks,
        teacher: [...teachersInvolved.selectedOptions].map(option => option.value),
        student: students
    })
    idBox.value = ''
    displayIncident()
}

function showStudents() {
    const studentDiv = students.map(s => userRepository.studentToHTML(s))
    studentsInvolved.innerHTML = studentDiv.join('')
}
