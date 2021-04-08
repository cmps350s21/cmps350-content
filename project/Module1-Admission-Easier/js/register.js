import * as AuthRepo from '../repository/AuthRepo.js'

const registrationForm = document.querySelector('#registration_form')
registrationForm.addEventListener('submit', register)

let isEditing = false

// To check if editing mode, then populate the user object to the form
const id = parseInt(AuthRepo.getUpdateUserId());
if (id) {
    const user = await AuthRepo.getUserById(id);
    console.log("User to be updated:", user)
    // Convert JSON object to Form
    FormDataJson.fillFormFromJsonValues(registrationForm, user)
    isEditing = true
}

async function register(event) {
    if (!registrationForm.checkValidity()) return
    // Prevent default action of the submit button
    event.preventDefault()

    // Start do what i want to happen on submit clicked
    const newRegistration = formToObject(registrationForm)
    if (isEditing) {
        console.log("User after Updating:", newRegistration)
        newRegistration.id = id;
        console.log(newRegistration.id)
        const response = await AuthRepo.updateUser(newRegistration)
        isEditing = false
        AuthRepo.removeUpdateUserId();
        alert(`You have update your account successfully! user id: ${response}`)
    } else {
        newRegistration.role = 'parent'
        const response = await AuthRepo.registerUser(newRegistration)
        alert(`You have creat an account successfully! user id: ${response}`)
    }
    window.location = "../html/home.html"
    registrationForm.reset()
}

function formToObject(formElement) {
    const formData = new FormData(formElement);
    const data = {}
    for (const [key, value] of formData) {
        data[key] = value;
    }
    return data;
}
