import {
    getDB,
    getChildren,
    years,
    days,
    fromtimes,
    getParent,
    getStudent,
    getSections,
    getTeachers, getTeacher, getStudentByStudentID
} from "./repository.js";

getDB

const dropDown = document.querySelector("#dropDown")
const dropDownLabel = document.querySelector("#dropDownLabel")
const timetable = document.querySelector("#timetable")

window.displayTimetable = displayTimetable
window.populateChildren = populateChildren

let currentYear = new Date().getFullYear()
let userType=JSON.parse(localStorage.getItem("userType"))
let userID = JSON.parse(localStorage.getItem("userID"))
let user;

let teachers = await getTeachers()

displayDD()

async function displayDD(){
    if(userType=="Parent"){

        user = await getParent(userID)

        let children = await getChildren(userID)
        console.log(children.length)

        if(children.length > 1) {

            dropDownLabel.innerHTML = "Choose which child's timetable you would like to view"
            populateChildren(children)

        }else{
            dropDownLabel.hidden = true
            dropDown.hidden = true

            await displayTimetable(children[0].studentID)
        }
    }else{
        user = await getTeacher(userID)
        dropDown.innerHTML += `${years.map(yr => `<option value="${yr}">${yr}</option>`)}`
    }
}


export function populateChildren(children) {
    console.log(children)
    dropDown.innerHTML += `${children.map(child => `<option value="${child.studentID}">${child.studentName}</option>`)}`
}

export async function displayTimetable(data) {

    let weekdays = days
    let classFromTimes = fromtimes

    if(userType=="Parent"){
        console.log(data)

        let student = await getStudentByStudentID(data)

        if(student.yearOfGrade === currentYear){
            let sectionName = student.sectionName
            let sections = await getSections(currentYear, student.currentGrade)

            let section = sections.filter(sec => sec.sectionName === sectionName)

            if(section[0] == undefined){
                timetable.innerHTML = `<h3>${student.studentName} has not been enrolled in a section yet for this year. Please contact the school registration</h3>`
            }else {
                let classes = section[0].classes

                let orderedClasses = []
                weekdays.forEach(day => {
                    let daySchedule = classes.filter(cl => cl.day == day)
                    if (daySchedule.length !== 0) {
                        let ordered = daySchedule.map(cl => {
                            let n = classFromTimes.indexOf(cl.fromTime)
                            return [n, cl]
                        }).sort().map(order => order[1])

                        ordered.forEach(cl => orderedClasses.push(cl))
                    }
                })

                const timetableRows = orderedClasses.map(cl => classToTimetableRow(cl))
                timetable.innerHTML = `
            <thead>
                <tr>
                    <th>Day</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>${timetableRows.join('')}</tbody>`
            }
        }else{
            timetable.innerHTML = `<h3>${student.studentName} is not enrolled in any section this year. Please contact the school registration</h3>`
        }
    }else{
        let classes = user.classes

        classes = classes.filter(cl => cl.year == data)

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

        const timetableRows = orderedClasses.map(cl => classToTimetableRow(cl))

        timetable.innerHTML = `
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
}

function classToTimetableRow(cl) {
    if(userType=="Parent") {
        let teacher = teachers.filter(t => t.teacherName === cl.teacher)[0]

        return `
        <tr>
            <td>${cl.day}</td>
            <td>${cl.fromTime}</td> 
            <td>${cl.toTime}</td>
            <td>${cl.subject}</td>
            <td>${cl.teacher}</td>
            <td>${teacher.classroom}</td>
        </tr>
    `
    }else{
        console.log(cl)
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
}