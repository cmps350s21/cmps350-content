import {
    getTeacher,
    getParent,
    getPrincipal,
    getDB
} from "./repository.js";
getDB()
const formElement = document.querySelector('#form')
formElement.addEventListener('submit', userLogin)


async function userLogin() {
    event.preventDefault()
    console.log("here")
    let invalid = false
    const user = form2Object(formElement);
    let teacher = await getTeacher(user.userName)
    let parent = await getParent(user.userName)
    let principal = await getPrincipal(user.userName)
    if (teacher != undefined) {
        console.log("teacher")
        if (user.userName == teacher.teacherId && user.password != teacher.password) {
            alert("Wrong password")
            invalid = true
        } else {
            localStorage.setItem("userType", JSON.stringify("Teacher"))
            invalid = false
            window.location.href = 'timetable-viewer.html'
        }
    } else if (parent != undefined) {
        if (user.user == parent.parentID && user.password != parent.password) {
            alert("Wrong Password")
            invalid = true
        } else {
            localStorage.setItem("userType", JSON.stringify("Parent"))
            invalid = false
            window.location.href = 'timetable-viewer.html'
        }
    } else if (principal != undefined) {
        console.log("here")
        if (principal.principalId == user.userName && user.password != principal.password) {
            alert("Invalid Password")
            invalid = true
        } else {
            localStorage.setItem("userType", JSON.stringify("principal"))
            invalid = false
            window.location.href = 'mainPage.html'
        }
    } else {
        alert("Wrong Username")
    }
    if (!invalid) {
        localStorage.setItem("userID", JSON.stringify(user.userName))
    }


}

function form2Object(formElement) {
    const formData = new FormData(formElement)
    const data = {}
    for (const [key, value] of formData) {
        data[key] = value
    }
    return data
}