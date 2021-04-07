import * as userRepository from './userRepository.js';


const loginButton = document.querySelector("#loginButton");
const emailSpan = document.querySelector("#emailError");
const passwordSpan = document.querySelector("#passwordError");
const loginSpan = document.querySelector("#loginError");

document.addEventListener("DOMContentLoaded", () => {
});

//Check if user is already logged in
let CheckAuth = () => {
    let loginStatus = userRepository.getLoginStatus();
    if (loginStatus != false) {
        //redirect to main page
        window.location = '../index.html'
    }
};

let login = () => {
    //Remove Errors
    loginSpan.innerText = '';
    emailSpan.innerText = '';
    passwordSpan.innerText = '';

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    //Check email and password
    if (email.length === 0 || password.length === 0 || !email.match("[a-zA-Z0-9_]{3,}@[a-zA-Z0-9_]{3,}.[a-zA-Z0-9_]{2,4}")) {
        if (email.length == 0 || !email.match("[a-zA-Z0-9_]{3,}@[a-zA-Z0-9_]{3,}.[a-zA-Z0-9_]{2,4}"))
            emailSpan.innerText = 'Please Fill In The Email';
        if (password.length == 0)
            passwordSpan.innerText = 'Please Fill In a Password';
    }
    else {
        let response = userRepository.login(email, password);
        if (response.success != true) {
            loginSpan.innerText = response.message;
        } else {
            window.location = '../index.html'
        }
    }
}

loginButton.addEventListener("click", login);

CheckAuth();
