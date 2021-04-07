getDB()

import {
    days,
    endtimes,
    fromtimes,
    getSection,
    getSections,
    getTeachers,
    updateSection,
    grades,
    subjects,
    updateTeacher,
    years, getDB, getTeacher
} from "./repository.js";

const yearsDD = document.querySelector("#year")
const gradeDD = document.querySelector("#grade")
const sectionDD = document.querySelector("#section")
const dayDD = document.querySelector("#day")
const fromtimeDD = document.querySelector("#from-time")
const totimeDD = document.querySelector("#to-time")
const subjectDD = document.querySelector("#subject")
const teachersDD = document.querySelector("#teacher")
const submitBtn = document.querySelector("#submit")
const classesTimetable = document.querySelector("#classesTimetable")
const sectionTimetableForm = document.querySelector("#section-timetable-form")
const sectionNavTab = document.querySelector("#sectionTab")
const timetableNavTab = document.querySelector("#timetablesTab")
const studentListTab = document.querySelector("#studentListTab")
const teacherDD = document.querySelector("#teacherDD")
const sectionInfo = document.querySelector("#section-info")
const teacherOption = document.querySelector("#teacherOption")
const sectionOption = document.querySelector("#sectionOption")
const teacherSelector = document.querySelector("#teacherSelector")

let currentYear = new Date().getFullYear()
let year;
let chosenGrade;
let teachers;
let chosenFromTime;
let chosenDay;
let currentSections;
let chosenSubject;
let chosenSection;
let isEdit = false;
let updated = false;
const nullChoice = "--------"
window.populateSection = populateSection
window.populateClassInfo = populateClassInfo
window.handleDeleteClass = handleDeleteClass
window.editClass = editClass
window.populateTeachers = populateTeachers
window.displayTimetableForm = displayTimetableForm
window.displayTeacherClasses = displayTeacherClasses

teacherDD.style.display = "none"
teacherSelector.style.display = "none"
sectionTimetableForm.style.display = "none"
sectionInfo.style.display = "none"

export async function displayTimetableForm (element) {

    if (element == teacherOption.id) {
        teacherSelector.style.display = "block"
        teacherDD.style.display = "block"
        sectionTimetableForm.style.display = "none"
        sectionInfo.style.display = "none"
        classesTimetable.innerHTML =  ``

        const teachers = await getTeachers()

        teacherDD.innerHTML += `${teachers.map(teacher => `<option value="${teacher.teacherId}">${teacher.teacherName}</option>`)}`

    } else if (element == sectionOption.id) {
        teacherSelector.style.display = "none"
        sectionTimetableForm.style.display = "block"
        sectionInfo.style.display = "block"
        teacherDD.style.display = "none"
        classesTimetable.innerHTML = ``


    }
}
resetDD(sectionDD)
populate(yearsDD, years)
populate(gradeDD, grades)
let sharedSection = JSON.parse(localStorage.getItem("sharedSection"))
let isShared = JSON.parse(localStorage.getItem("isShared"))
if (isShared == "true") {
    await displayTimetableForm(sectionOption.id)
    yearsDD.value = currentYear
    gradeDD.value = sharedSection.grade
    await populateSection(gradeDD.value)
    sectionDD.value = sharedSection.sectionName
    year = currentYear
    await populateClassInfo()
    localStorage.removeItem('sharedSection')
    localStorage.removeItem('isShared')
}

export async function displayTeacherClasses(teacherID){
    let weekdays = days
    let classFromTimes = fromtimes

    const teacher = await getTeacher(teacherID)

    let classes = teacher.classes

    classes = classes.filter(cl => cl.year == currentYear)

    let orderedClasses = []
    weekdays.forEach(day => {
        let daySchedule = classes.filter(cl => cl.day == day)
        if(daySchedule.length !== 0) {
            let ordered = daySchedule.map(cl => {
                let n = classFromTimes.indexOf(cl.fromTime)
                return [n, cl]
            }).sort().map(order => order[1])

            ordered.forEach(cl => orderedClasses.push(cl))
        }
    })

    const timetableRows = orderedClasses.map(cl => classToRow(cl))

    classesTimetable.innerHTML = `
        <thead>
            <tr>
                <th>Day</th>
                <th>Section</th>
                <th>Subject</th>
                <th>From Time</th>
                <th>To Time</th>
            </tr>
        </thead>
        <tbody>${timetableRows.join('')}</tbody>
        `
}

function classToRow(cl){
    return `
        <tr>
        <td>${cl.day}</td>
        <td>${cl.section}</td>
        <td>${cl.subject}</td>
        <td>${cl.fromTime}</td>
        <td>${cl.toTime}</td>
        </tr>
        `
}

yearsDD.setYear = function (yearChoice) {
    if(isEdit){
     alert("Please confirm current edit before continuing")
        yearsDD.value = year
    }else {
        year = yearChoice
    }
}

sectionNavTab.addEventListener("click", event => {window.location.href = "./section.html"})
studentListTab.addEventListener("click", event => {window.location.href = "./student.html"})
timetableNavTab.addEventListener("click", event => {window.location.href = "./timetable-editer.html"})


yearsDD.populateGrades = function () {
    if(!isEdit){
        populate(gradeDD, grades)
        resetDD(sectionDD)
    }
}

async function populateSection(grade) {
    if(isEdit){
        alert("Please confirm current edit before continuing")
        gradeDD.value = chosenGrade
    }else {
        let sections = await getSections(year, grade)
        chosenGrade = grade
        currentSections = sections
        populate(sectionDD, sections.map(sec => sec.sectionName))
        resetDD(dayDD, fromtimeDD, totimeDD, subjectDD, teachersDD)
    }
}


async function populateClassInfo() {
    if(isEdit){
        alert("Please confirm current edit before continuing")
        sectionDD.value = chosenSection
    }else {
        chosenSection = sectionDD.options[sectionDD.selectedIndex].value
        if (year == currentYear) {
            enableAll(dayDD, fromtimeDD, totimeDD, subjectDD, teachersDD, submitBtn)
            populate(dayDD, days)
            populate(fromtimeDD, fromtimes)
            populate(totimeDD, endtimes)
            populate(subjectDD, subjects)
        } else {
            disableAll(dayDD, fromtimeDD, totimeDD, subjectDD, teachersDD, submitBtn)
        }

        await showClasses(year, chosenGrade)

        teachers = await getTeachers()
    }
}


dayDD.getDay = function (day) {
    chosenDay = day
    resetDD(fromtimeDD, totimeDD, subjectDD, teachersDD)
    populate(fromtimeDD, fromtimes)
    populate(totimeDD, endtimes)
    populate(subjectDD, subjects)
}

fromtimeDD.getFromTime = function (fromTime) {
    chosenFromTime = fromTime
    resetDD(totimeDD, teachersDD)
    populate(totimeDD, endtimes)
}

subjectDD.getSubject = function (subject){
    chosenSubject = subject
    resetDD(totimeDD, fromtimeDD, teachersDD)
    populate(fromtimeDD, fromtimes)
    populate(totimeDD, endtimes)
}

export function populateTeachers() {


    let subjectTeachers = teachers.filter(t => t.fieldOfProf.toUpperCase() === chosenSubject.toUpperCase())
    subjectTeachers = subjectTeachers.map(t => {
        return {...t, classes: t.classes.filter(cl => cl.year == year)}
    })

    subjectTeachers = subjectTeachers.map(t => {
        return {...t, classes: t.classes.filter(cl => cl.day.toUpperCase() === chosenDay.toUpperCase())}
    })

    subjectTeachers = subjectTeachers.map(t => {
        return {...t, classes: t.classes.map(cl => cl.fromTime)}
    })

    let availableTeachers = subjectTeachers.map(t => {
        return {...t, classes: t.classes.filter(cl => cl === chosenFromTime)}
    })
        .filter(t => t.classes.length === 0)

    if (availableTeachers.length === 0) {
        alert("There are no teachers available for this subject at this time. Please choose a different date and/or time to continue")
    }
    populate(teachersDD, availableTeachers.map(t => t.teacherName))
}

submitBtn.addEventListener('click', async function (event) {
    event.preventDefault()

    let year = yearsDD.options[yearsDD.selectedIndex].value

    if (year === nullChoice) {
        alert("Please choose a Year to continue")
    } else {
        let grade = gradeDD.options[gradeDD.selectedIndex].value

        if (grade === nullChoice) {
            alert("Please choose a grade to continue")
        } else {
            let section = sectionDD.options[sectionDD.selectedIndex].value

            if (section === nullChoice) {
                alert("Please choose a section to continue")
            } else {
                let day = dayDD.options[dayDD.selectedIndex].value

                if (day === nullChoice) {
                    alert("Please choose a Day to continue")
                } else {
                    let fromTime = fromtimeDD.options[fromtimeDD.selectedIndex].value

                    if (fromTime === nullChoice) {
                        alert("Please choose the start time for this class to continue")
                    } else {

                        let toTime = totimeDD.options[totimeDD.selectedIndex].value

                        if (toTime === nullChoice) {
                            alert("Please choose the end time for this class to continue")
                        } else {
                            let toTimePos = endtimes.findIndex(t => t === toTime)
                            let fromTimePos = fromtimes.findIndex(t => t === fromTime)

                            if (fromTimePos >= toTimePos) {
                                alert("The starting time for the class cannot be later than or equal to the ending time")
                            } else {

                                let index = currentSections.findIndex(sec => sec.sectionName === section)

                                let sectionToCheck = currentSections[index]
                                sectionToCheck = {
                                    ...sectionToCheck,
                                    classes: sectionToCheck.classes.filter(cl => cl.day === day).map(cl => cl.fromTime)
                                }
                                let classStartTimes = sectionToCheck.classes

                                if (classStartTimes.includes(fromTime)) {
                                    console.log(classStartTimes)
                                    console.log(fromTime)
                                    alert("The time chosen for the class contradicts with an existing class")
                                } else {
                                    // let subject = subjectDD.options[subjectDD.selectedIndex].value

                                    let subject = chosenSubject

                                    if (subject === nullChoice) {
                                        alert("Please choose a subject to continue")
                                    } else {
                                        let selectedTeacher = teachersDD.options[teachersDD.selectedIndex].value
                                        console.log(selectedTeacher)
                                        if (selectedTeacher === nullChoice) {
                                            alert("Please select a teacher to continue")
                                        } else {
                                            let newSectionClass = {
                                                subject: subject + "-" + grade,
                                                fromTime: fromTime,
                                                toTime: toTime,
                                                day: day,
                                                teacher: selectedTeacher
                                            }

                                            let currentSections = await getSections(year, grade)
                                            let sectionToUpdate = currentSections.filter(sec => sec.sectionName === section)[0]

                                            sectionToUpdate.classes.push(newSectionClass)
                                            let val = await updateSection(sectionToUpdate)

                                            let newTeacherClass = {
                                                grade: parseInt(grade),
                                                section: section,
                                                subject: subject + "-" + grade,
                                                year: currentYear,
                                                fromTime: fromTime,
                                                toTime: toTime,
                                                day: day
                                            }

                                            let currentTeachers = await getTeachers()
                                            let teacher = currentTeachers.filter(t => t.teacherName === selectedTeacher)[0]

                                            teacher.classes.push(newTeacherClass)
                                            let val2 = await updateTeacher(teacher)

                                            resetDD(subjectDD, fromtimeDD, totimeDD, teachersDD)

                                            // populate(dayDD, days)
                                            populate(subjectDD, subjects)
                                            populate(fromtimeDD, fromtimes)
                                            populate(totimeDD, endtimes)

                                            await showClasses(year, grade)
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if(isEdit) {
        submitBtn.value = "Add Class"
        isEdit = false;
        updated = true;
    }
})

async function showClasses(year, grade, currentSections) {
    let sections
    if(currentSections === undefined) {
       sections = await getSections(year, grade)
    }else{
        sections = currentSections
    }
    let sectionToView = sections.filter(sec => sec.sectionName === chosenSection)[0]

    let classes = sectionToView.classes
    let weekdays = days
    let classFromTimes = fromtimes
    let orderedClasses = []
    weekdays.forEach(day => {
        let daySchedule = classes.filter(cl => cl.day == day)
        if (daySchedule.length !== 0) {
            console.log(daySchedule)
            let ordered = daySchedule.map(cl => {
                let n = classFromTimes.indexOf(cl.fromTime)
                return [n, cl]
            }).sort().map(order => order[1])
            console.log(ordered)
            ordered.forEach(cl => orderedClasses.push(cl))
        }

    console.log(orderedClasses)
    })
    const timetableRows = orderedClasses.map(cl => classToTimetableRow(cl, sectionToView))
    classesTimetable.innerHTML = `
        <thead>
            <tr>
                <th>Day</th>
                <th>From</th>
                <th>To</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>${timetableRows.join('')}</tbody>
    `
}

export async function editClass(event , clIndex, sectionToView) {

    if(isEdit){
        alert("Please confirm current edit before editing another section")
    }else {

        let section = await getSection(sectionToView)

        event.preventDefault()

        if (section.year !== currentYear) {
            alert("You cannot edit this section as it is from a previous year")
        } else {
            isEdit = true
            updated = false
            let classes = section.classes

            let cl = classes[clIndex]

            section.classes.splice(clIndex, 1)

            let v = await updateSection(section)

            let currentTeachers = await getTeachers()
            let teacher = currentTeachers.filter(t => t.teacherName === cl.teacher)[0]
            let teacherClasses = teacher.classes
            let teacherClass = teacherClasses.filter(c => c.year == currentYear && c.section === section.sectionName && c.subject === cl.subject && c.day === cl.day && c.fromTime === cl.fromTime)[0]

            let classIndex = teacher.classes.indexOf(teacherClass)

            console.log(classIndex)
            teacher.classes.splice(classIndex, 1)

            let v2 = await updateTeacher(teacher)

            teachers = await getTeachers()
            currentSections = await getSections(currentYear, cl.grade)

            submitBtn.value = "Update Class"
            dayDD.value = cl.day
            chosenDay = cl.day
            fromtimeDD.value = cl.fromTime
            chosenFromTime = cl.fromTime

            totimeDD.value = cl.toTime

            subjectDD.value = cl.subject.split("-")[0]

            populateTeachers(cl.subject.split("-")[0])

            teachersDD.value = cl.teacher

            console.log(cl.teacher)
        }
    }
}

export async function handleDeleteClass(event , clIndex, sectionToView) {
    let section = await getSection(sectionToView)

    if(section.year !== currentYear){
        alert("You cannot delete this section as it is from a previous year")
    }else {
        const confirmed = confirm(`Are you sure you want to delete this class?`);
        if (confirmed) {

            let classes = section.classes

            let cl = classes[clIndex]

            section.classes.splice(clIndex, 1)

            let v = await updateSection(section)

            let currentTeachers = await getTeachers()
            let teacher = currentTeachers.filter(t => t.teacherName === cl.teacher)[0]
            let teacherClasses = teacher.classes
            let teacherClass = teacherClasses.filter(c => c.year == currentYear && c.section === section.sectionName && c.subject === cl.subject && c.day === cl.day && c.fromTime === cl.fromTime)[0]

            let classIndex = teacher.classes.indexOf(teacherClass)

            console.log(classIndex)
            teacher.classes.splice(classIndex, 1)

            let v2 = await updateTeacher(teacher)

            teachers = await getTeachers()
            currentSections = await getSections(currentYear, cl.grade)
            await showClasses(year, grade, currentSections)
        }
    }
}


function classToTimetableRow(cl, sectionToView) {
    let classes = sectionToView.classes
    let clIndex = classes.indexOf(cl)
    return `
        <tr id="tr-class">
            <td>${cl.day}</td>
            <td>${cl.fromTime}</td> 
            <td>${cl.toTime}</td>
            <td>${cl.subject}</td>
            <td>${cl.teacher}</td>
            <td>
               <i class="fa fa-pencil" onclick="editClass(event,${clIndex},${sectionToView.id})">Update</i>
                <i class="fa fa-trash" onclick="handleDeleteClass(event, ${clIndex}, ${sectionToView.id})">Delete</i>
            </td>
        </tr>
    `
}


function populate(element, data) {
    const dataDD = element
    let dataToInsert = data
    resetDD(element)
    dataDD.innerHTML += `${dataToInsert.map(data => `<option value="${data}">${data}</option>`)}`
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


