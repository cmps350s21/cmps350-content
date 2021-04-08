import * as AuthRepo from '../repository/AuthRepo.js'

const loginEmail = document.querySelector('#email')
const loginPassword = document.querySelector('#password')

const loginForm = document.querySelector('#login_form')
loginForm.addEventListener('submit', login)

// Once the user open the home page, check if there is a current User logged in, if so navigate to Dashboard (Admissions Table)
const currentUser = await AuthRepo.getCurrentUser()
console.log("Current User: ", currentUser)
if (currentUser !== undefined && currentUser !== '') {
    window.location = "../html/user-home.html"
}

async function login(event) {
    if (!loginForm.checkValidity()) return
    // Prevent default action of the submit button
    event.preventDefault()

    // Start do what i want to happen on submit clicked
    const user = await AuthRepo.getUserByEmail(loginEmail.value)
    console.log(user)
    if (user !== undefined) {
        if (user.password === loginPassword.value) {
            AuthRepo.setCurrentUser(user.email)
            AuthRepo.setCurrentRole(user.role)
            alert("Welcome")
            loginForm.reset()
            window.location = "../html/user-home.html"
        } else
            alert("Login Failed")
    } else {
        alert("You are not registered yet, Please Register First!")
    }
}

const openAdmissionBtn = document.querySelector('.openAdmission')
openAdmissionBtn.addEventListener('click', openAdmission)

async function openAdmission() {
    const currentUser = await AuthRepo.getCurrentUser()
    if (currentUser !== undefined && currentUser !== '') {
        window.location = "../html/admission.html"
    } else
        alert('Please Login First!')
}

