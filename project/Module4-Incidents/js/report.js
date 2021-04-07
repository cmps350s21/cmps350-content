import * as incidentRepository from './incidentRepository.js';
import * as userRepository from './userRepository.js';

const idBox = document.querySelector('#id')
const studentsInvolved = document.querySelector('.generatedStudent')
const teacherSelect = document.querySelector('#teacher')
const formElement = document.querySelector('.reportForm')
const dateField = document.querySelector('#date')
const typeField = document.querySelector('#type')
const locationField = document.querySelector('#location')

window.addStudent = addStudent;
window.removeStudent = removeStudent;

formElement.addEventListener('submit', saveData)
dateField.value = new Date().toISOString().substring(0, 10)
locationField.innerHTML=await incidentRepository.getLocations()
typeField.innerHTML=await incidentRepository.getTypes()

let students = []
displayTeachers()

async function addStudent() {
    const studentData = await userRepository.getStudent(idBox.value)
    let found = false
    for (let s of students) {
        if (idBox.value == s.id) {
            found = true
        }
    }
    if (!found)
        students.push(studentData)

    idBox.value = ''
    showStudents()
}

function removeStudent(studentID) {
    students = students.filter(s => s.id != studentID)
    showStudents()
}

function showStudents() {
    const studentDiv = students.map(s => userRepository.studentToHTML(s))
    studentsInvolved.innerHTML = studentDiv.join('')
}

async function displayTeachers() {
    const teacherData = await userRepository.getTeachers()
    const teacherOptions = teacherData.map(t => `<option value="${t.name}">${t.name}</option>`)
    teacherSelect.innerHTML = teacherOptions.join('')
}

function clearData() {
    students = []
    formElement.reset()
    dateField.value = new Date().toISOString().substring(0, 10)
    showStudents()
}

async function saveData(event) {
    event.preventDefault()
    const formObject = incidentRepository.form2Object(formElement)
    formObject.student = students
    formObject.teacher = [...teacherSelect.selectedOptions]
        .map(option => option.value)
    formObject.id = Date.now().toString()
    formObject.attachment = ''
    formObject.note = ''
    formObject.penalty = ''
    let index = formObject.location
    formObject.location = [index, locationField.options[index].id]
    index = formObject.type
    formObject.type = [index, typeField.options[index].id]
    await incidentRepository.addIncident(formObject)
    clearData()
}

