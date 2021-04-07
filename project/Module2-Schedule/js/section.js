import {
    addSection,
    deleteSection,
    getSection,
    getSections,
    getTeachers,
    grades,
    updateSection,
    getStudents,
    updateStudent,
    years
} from "./repository.js";

const gradesDD = document.querySelector("#grade")
const yearsDDFilter = document.querySelector("#secYear")
const gradesDDFilter = document.querySelector("#secGrade")
const teachersDD = document.querySelector("#homeRoomTeacher")
const formElement = document.querySelector('#form')
const sectionsTable = document.querySelector('#sections')
let copySetUpBtn = document.querySelector('#copySetUp')
const showContent = document.querySelector('#show-content')
const sectionNavTab = document.querySelector("#sectionTab")
const timetableNavTab = document.querySelector("#timetablesTab")
const studentListTab = document.querySelector("#studentListTab")

let year;
let grade;
let isEdit = false
let sectionToBeEdited;
let sectionsList = await getSections()
let currentYear = new Date().getFullYear()
let filteredSections;


window.handleAddSection = handleAddSection;
window.handleDeleteSection = handleDeleteSection
window.editSection = editSection
window.copySetup = copySetup
window.viewSection = viewSection
window.navigate = navigate

formElement.addEventListener('submit', handleAddSection)

await showSections()
await checkCopySetUpBtn()
await getFilteredTeachers()

populate(document.querySelector('#secYear'), years)
populate(document.querySelector('#secGrade'), grades)
populate(gradesDD, grades)

sectionNavTab.addEventListener("click", event => {
    window.location.href = "./section.html"
})
studentListTab.addEventListener("click", event => {
    window.location.href = "./student.html"
})
timetableNavTab.addEventListener("click", event => {
    window.location.href = "./timetable-editer.html"
})

gradesDD.setGrade = function (gradeChoice) {
    grade = gradeChoice
    console.log(year)
}

yearsDDFilter.setYear = async function (yearChoice) {
    event.preventDefault()
    year = yearChoice
}
yearsDDFilter.populateGrades = async function () {
    populate(gradesDDFilter, grades)
    console.log(year)
    if (year == "--------") {
        console.log("Here")
        await showSections()
    } else {
        await showSections(year, undefined)
    }
}
gradesDDFilter.filterSections = async function (grade) {
    if (grade != "--------" && year == "--------") {
        await showSections(undefined, grade)
    } else {
        await showSections(year, grade)
    }
}

async function getFilteredTeachers() {
    let sections = await getSections()
    let teachers = await getTeachers()
    for (let section in sections) {
        filteredSections = Object.values(sections).filter(sec => sec.year == currentYear)
    }
    let index = 0
    for (const teacher of teachers) {
        for (const section of filteredSections) {
            if (teacher.teacherName == section.homeRoomTeacher) {
                delete teachers[index]
            }

        }
        index++
    }
    console.log(teachers)
    populate(teachersDD, teachers.map(teacher => `${teacher.teacherName}`))
}


async function handleAddSection(event) {
    const isFormValid = formElement.checkValidity();
    if (!isFormValid) return;
    event.preventDefault();
    const section = form2Object(formElement);
    section.classes = []
    section.students = []
    let isValid = checkSectionGradeName(section.sectionName, section.grade)
    if (isValid) {
        if (section.grade == "--------" || section.homeRoomTeacher == "--------") {
            alert("Missing information, please fill all the inputs")
        } else {
            section.year = currentYear
            if (!isEdit) {
                let editSection
                let existSection = await checkSectionExist(section)
                if (existSection.length != 0) {
                    editSection = existSection[0]
                    const confirmed = confirm(`section ${section.sectionName} already exist, do you want to update?`);
                    if (confirmed) {
                        section.id = editSection.id
                        await updateSection(section)
                    }
                } else {
                    await addSection(section);
                }
            } else {
                console.log(section);
                section.id = sectionToBeEdited.id
                await updateSection(section)
            }
            formElement.reset()
            await getFilteredTeachers()
            await showSections()
        }
    } else {
        alert("Grade in section name should match the input grade")
    }
}

async function checkSectionExist(section) {
    let filteredSection = sectionsList.filter(sec => sec.sectionName == section.sectionName && sec.year == currentYear)
    return filteredSection
}

function checkSectionGradeName(sectionName, grade) {
    let sectionGrade = sectionName.split("-")
    if (sectionGrade[1] == grade) {
        return true
    } else {
        return false
    }

}

async function showSections(year, grade) {
    const sections = await getSections(year, grade)
    const sectionsRows = sections.map(section => sectionsToHTMLRow(section))
    sectionsTable.innerHTML = `
        <thead>
            <tr>
                <th>Section name</th>
                <th>Capacity</th>
                <th>Home Room Teacher</th>
                <th>Grade</th>
                <th>Year</th>
                <th></th>
            </tr>
        </thead>
        <tbody>${sectionsRows.join('')}</tbody>
    `
}

export async function handleDeleteSection(sectionId) {
    let section = await getSection(sectionId)
    if (section.year != currentYear) {
        alert("you cannot delete this section")
    } else {
        const confirmed = confirm(`Are you sure you want to delete section ${section.sectionName}?`);
        if (confirmed) {
            await deleteSection(sectionId);
            let students= await getStudents()
            let sectionStudents=students.filter(student=>student.sectionName==section.sectionName && student.yearOfGrade==currentYear)
            for(const student of sectionStudents){
                student.sectionName=" "
                await updateStudent(student)
            }

        }
        await getFilteredTeachers()
        await showSections()
    }
}

export async function editSection(event, sectionId) {
    isEdit = true
    sectionToBeEdited = await getSection(sectionId)
    if (sectionToBeEdited.year !== currentYear) {
        alert("you cannot update this section")
    } else {
        document.querySelector('#add-section-header').innerHTML = "Update Section"
        document.querySelector('#grade').value = sectionToBeEdited.grade
        document.querySelector('#sectionName').value = sectionToBeEdited.sectionName
        document.querySelector('#capacity').value = sectionToBeEdited.capacity
        document.querySelector('#homeRoomTeacher').innerHTML += `<option value="${sectionToBeEdited.homeRoomTeacher}">${sectionToBeEdited.homeRoomTeacher}</option>`
        document.querySelector('#homeRoomTeacher').value = sectionToBeEdited.homeRoomTeacher
    }
}

async function checkCopySetUpBtn() {
    let currentYearSections = await getSections(currentYear, undefined)
    console.log()
    if (currentYearSections.length != 0) {
        copySetUpBtn.style.display = "none"
    } else {
        copySetUpBtn.style.display = "block"
    }
}

export async function copySetup() {
    let lastYear = currentYear - 1
    let lastYearSections = await getSections(lastYear, undefined)
    console.log(lastYearSections)
    for (const section of lastYearSections) {
        section.year = currentYear
        await addSection(section)
    }
    await checkCopySetUpBtn()

    await showSections()

}

async function navigate(clickedBtn, sectionId) {
    let section = await getSection(sectionId)
    if(section.year!=currentYear){
        alert(`You cannot ${clickedBtn} to this section`)
    }else {
        console.log(section)
        localStorage.setItem("sharedSection", JSON.stringify(section));
        localStorage.setItem("isShared", JSON.stringify("true"));
        await handleAddSection(event)
        if (clickedBtn == "add-students")
            window.location.href = "student.html"
        else if (clickedBtn == "add-courses")
            window.location.href = "timetable-editer.html"
    }

}

function populate(element, data) {
    const dataDD = element
    let dataToInsert = data
    dataDD.innerHTML = `<option>--------</option>`
    dataDD.innerHTML += `${dataToInsert.map(data => `<option value="${data}">${data}</option>`)}`
}

function form2Object(formElement) {
    const formData = new FormData(formElement)
    const data = {}
    for (const [key, value] of formData) {
        data[key] = value
    }
    return data
}

function sectionsToHTMLRow(section) {
    return `
        <tr>
            <td onclick="viewSection(${section.id})" id="td-sectionName">${section.sectionName}</td>
            <td>${section.capacity}</td> 
            <td>${section.homeRoomTeacher}</td>
            <td>${section.grade}</td>
            <td>${section.year}</td>
            <td>
             <i id="add-courses" class="fa fa-book" onclick="navigate(this.id,${section.id})">Add courses</i>
                <i id="add-students" class="fa fa-users" onclick="navigate(this.id,${section.id})">Add students</i>
                <br>
               <i id="edit-icon" class="fa fa-pencil" onclick="editSection(event,${section.id})">Update</i>
                <i id="delete-icon" class="fa fa-trash" onclick="handleDeleteSection(${section.id})">Delete</i>
               
            </td>
        </tr>
    `
}

async function viewSection(sectionId) {
    showContent.innerHTML = ""
    let section = await getSection(sectionId)
    let modal = document.querySelector("#view-modal");
    let main = document.querySelector("#main")
    let exit = document.querySelector("#exit-modal")
    let secDetailsBtn = document.querySelector("#viewSection")
    let secCoursesBtn = document.querySelector("#viewCourses")
    let secStudentsBtn = document.querySelector("#viewStudents")
    modal.style.display = "block";
    showContent.innerHTML = getSectionDetails(section)
    window.onclick = function (event) {
        if (event.target == modal || event.target == main) {
            modal.style.display = "none";
        }
    }
    exit.onclick = function (event) {
        modal.style.display = "none";
    }
    secDetailsBtn.onclick = function () {
        showContent.innerHTML = getSectionDetails(section)
    }
    secCoursesBtn.onclick = async function () {
        showContent.innerHTML = await timetableClassesDisplay(section)
    }
    secStudentsBtn.onclick = async function () {
        showContent.innerHTML = await viewStudents(section)
    }

}

function getSectionDetails(section) {
    return `
    <div id="section-div">
    <p><b>Section's name: </b> ${section.sectionName}</p>
    <br>
    <p><b>Section's grade: </b> ${section.grade}</p>
    <br>
    <p><b>Section's academic year: </b> ${section.year}</p>
    <br>
    <p><b>Section's home room teacher: </b> ${section.homeRoomTeacher}</p>
    <br>
    <p><b>Section's capacity: </b> ${section.capacity}</p>
    </div>
    `
}

async function timetableClassesDisplay(sectionToView) {
    const section = await getSection(sectionToView.id)
    let classes = section.classes
    if (classes !== undefined) {
        let showCourses = classes.map(cl =>
            ` 
        <tr>
            <td>${cl.day}</td>
            <td>${cl.fromTime}</td> 
            <td>${cl.toTime}</td>
            <td>${cl.subject}</td>
            <td>${cl.teacher}</td>
        </tr>
        `
        )
        return `
    <table id="show-courses-table">
    <thead>
    <tr>
       <th>Day</th>
                <th>From</th>
                <th>To</th>
                <th>Subject</th>
                <th>Teacher</th>
                </tr>
        </thead>
        <tbody>${showCourses.join('')}</tbody>
        
        </table>
    `

    } else {
        return `
        <p id="no-courses-p">
        This section has no courses to show
    </p>
        `
    }
}

async function viewStudents(section) {
    let students = section.students
    const studentRows = students.map(student => studentsToHTMLRow(student))
    return `
<table>
        <thead>
            <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Student Grade</th>
            </tr>
        </thead>
        <tbody>${studentRows.join('')}</tbody>
        </table>
    `

}

function studentsToHTMLRow(student) {
    return `
        <tr>
            <td>${student.studentID}</td>
            <td>${student.studentName}</td>
            <td>${student.currentGrade}</td>
        </tr>
    `
}
