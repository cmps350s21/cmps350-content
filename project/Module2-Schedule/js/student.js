import {
    years,
    grades,
    getSections,
    getStudents,
    addStudent,
    deleteStudent,
    getDB, updateSection,
    updateStudent, getSection, getStudent
    // addStudentsToSections
} from "./repository.js";

getDB()

window.deleteStuFromSec = deleteStuFromSec
document.querySelector('#delete-students').style.display = "none"
window.showStudents = showStudents

const yearFilter = document.querySelector("#secYear")
const gradesFilter = document.querySelector("#secGrade")
const sectionFilter = document.querySelector("#secName")

window.selectStudent = selectStudent
window.deleteStudents = deleteStudents
window.filterStudents = filterStudents


const studentDD = document.querySelector("#student")
const submitBtn = document.querySelector("#submit")

const formElement = document.querySelector('#form')
const studentTable = document.querySelector('#students')
const sectionNavTab = document.querySelector("#sectionTab")
const timetableNavTab = document.querySelector("#timetablesTab")
const studentListTab = document.querySelector("#studentListTab")
sectionNavTab.addEventListener("click", event => {
    window.location.href = "./section.html"
})
studentListTab.addEventListener("click", event => {
    window.location.href = "./student.html"
})
timetableNavTab.addEventListener("click", event => {
    window.location.href = "./timetable-editer.html"
})


let year;
let grade;
let currentYear = new Date().getFullYear()
const nullChoice = "--------"

let selectedStudents = []
let currentSection
populate(yearFilter, years)
populate(gradesFilter, grades)
// populate(gradesDD, grades)


let sharedSection = JSON.parse(localStorage.getItem("sharedSection"))
let isShared = JSON.parse(localStorage.getItem("isShared"))
localStorage.removeItem('sharedSection')
localStorage.removeItem('isShared')
console.log(sharedSection)
if (isShared == "true") {
    yearFilter.value = currentYear
    year = currentYear
    gradesFilter.value = sharedSection.grade
    await filterStudents()
    await filterSectionsShared(currentYear, sharedSection.grade)
    console.log(sharedSection.sectionName)
    sectionFilter.value = sharedSection.sectionName
    await showStudents(sharedSection.sectionName)
}

async function filterSectionsShared(year, gradeChoice) {
    grade = gradeChoice
    let sections = await getSections(year, gradeChoice)
    resetDD(sectionFilter)
    studentTable.innerHTML = ``
    populate(sectionFilter, sections.map(section => section.sectionName))
}

gradesFilter.addEventListener('change', filterStudents)

async function filterStudents() {
    if (year == currentYear) {
        let students = await getStudents()
        let availableStudents = Object.values(students).filter(stu => stu.currentGrade.toString() === gradesFilter.value);
        let emptySectionStudents = availableStudents.filter(s => s.sectionName === " ");
        populate(studentDD, emptySectionStudents.map(student => student.studentName))
    }

}

formElement.addEventListener('submit', handleAddStudent)

yearFilter.setYear = function (yearChoice) {
    year = yearChoice
    if (yearChoice != currentYear) {
        document.querySelector('#delete-students').style.display = "none"
    }
    if (year == currentYear) {
        enableAll(studentDD, submitBtn)
    } else {
        studentDD.innerHTML = `<option>--------</option>`
        disableAll(studentDD, submitBtn)
    }

    resetDD(sectionFilter, gradesFilter)
    studentTable.innerHTML = ``
    populate(gradesFilter, grades)
    console.log(year)
}

gradesFilter.filterSections = async function (gradeChoice) {
    grade = gradeChoice
    let sections = await getSections(year, gradeChoice)
    resetDD(sectionFilter)
    studentTable.innerHTML = ``
    populate(sectionFilter, sections.map(section => section.sectionName))
}
sectionFilter.displayStudents = async function (sectionName) {
    currentSection = sectionName
    await showStudents(sectionName)
}

function populate(element, data) {
    const dataDD = element
    let dataToInsert = data
    dataDD.innerHTML = `<option>--------</option>`
    dataDD.innerHTML += `${dataToInsert.map(data => `<option value="${data}">${data}</option>`)}`
}

async function handleAddStudent(event) {
    event.preventDefault();

    let students = await getStudents()
    console.log(students)

    let chosenStudents = [];
    for (let i = 0; i < studentDD.length; i++) {
        if (studentDD.options[i].selected) chosenStudents.push(studentDD.options[i].value);
    }
    console.log(chosenStudents)
    let foundStudents = [];
    for (let student of chosenStudents) {
        foundStudents.push(students.filter(stu => stu.studentName == student)[0]);
    }

    console.log(foundStudents)
    foundStudents.forEach(s => s.sectionName = sectionFilter.value);

    for (let s of foundStudents) {
        await updateStudent(s);
    }
    await addStudent(currentYear, grade)

    async function addStudent(year, grade) {
        let sections = await getSections(year, grade)
        console.log(sections)
        console.log(sectionFilter.value)
        console.log(sectionFilter[sectionFilter.options.selectedIndex].value)
        let chosenSection = Object.values(sections).filter(sec => sec.sectionName == sectionFilter[sectionFilter.options.selectedIndex].value)


        chosenSection.forEach(se => se.students.push(...foundStudents))

        await updateSection(chosenSection[0]);

    }

    await showStudents(sectionFilter[sectionFilter.options.selectedIndex].value)

    await filterStudents()

}

async function showStudents(sectionName) {
    const students = await getStudents()

    console.log(students)
    const sectionStudents = Object.values(students).filter(student => student.sectionName == sectionName)

    console.log(sectionStudents)

    const studentRows = sectionStudents.map(student => studentsToHTMLRow(student))
    studentTable.innerHTML = `
        <thead>
            <tr>
            <th></th>
                <th>Student ID</th>
                <th>Student Name</th>
            </tr>
        </thead>
        <tbody>${studentRows.join('')}</tbody>
    `
    if (year == currentYear) {
        document.querySelector('#delete-students').style.display = "block"
    }

}

function studentsToHTMLRow(student) {
    return `
        <tr>
        <td><input type="checkbox" name="selected-student" onclick="selectStudent(${student.id})"></td>
            <td>${student.studentID}</td>
            <td>${student.studentName}</td>
        </tr>
    `
}

async function selectStudent(studentId) {
    let student = await getStudent(studentId)
    console.log(student)
    selectedStudents.push(student)
}

async function deleteStudents() {
    console.log(selectedStudents)
    if (selectedStudents.length == 0) {
        alert("Please select students that you want to delete from this section")
    } else {
        const confirmed = confirm("Are you sure you want to delete these students from the section?")

        if (confirmed) {
            for (const student of selectedStudents) {
                await deleteStuFromSec(student.id)
            }
            selectedStudents = []
        }
    }

}

export async function deleteStuFromSec(studentID) {
    let student = await getStudent(studentID)
    console.log(`student: ${student.sectionName}`)
    let sections = await getSections(year, grade)
    console.log(sections)
    let section = sections.find(section => section.sectionName == student.sectionName && section.year == student.yearOfGrade)
    console.log(section)
    let sectionStudents = section.students.filter(st => st.studentID !== student.studentID)
    console.log(section.id)
    let sectionGet = await getSection(section.id)
    console.log(sectionGet.id)
    section.students = sectionStudents
    section.id = sectionGet.id
    student.sectionName = " "

    await updateStudent(student)
    await updateSection(section)
    await filterStudents()
    await showStudents(section.sectionName)
}

function resetDD(...dropdowns) {
    dropdowns.forEach(dd => dd.innerHTML = `<option>${nullChoice}</option>`)
}

function disableAll(...dropdowns) {
    dropdowns.forEach(dd => dd.disabled = true)
}

function enableAll(...dropdowns) {
    dropdowns.forEach(dd => dd.disabled = false)
}