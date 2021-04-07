import * as userRepository from './userRepository.js';

const usernameBox = document.querySelector('#username')
const passwordBox = document.querySelector('#pass')
const loginForm = document.querySelector('.loginForm')

loginForm.addEventListener('submit', login)

async function login(event) {
    event.preventDefault()
    const user = await userRepository.authenticate(usernameBox.value, passwordBox.value)
    if (user != undefined && user.children == undefined) {
        localStorage.setItem('loggedUser', JSON.stringify(user))
        window.open('index.html')
    } else if (user != undefined && user.children != undefined) {
        localStorage.setItem('loggedUser', JSON.stringify(user))
        window.open('getIncident.html')
    }
}
