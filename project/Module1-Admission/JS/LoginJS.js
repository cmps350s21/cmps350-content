import * as AccountsRepo from '../repo/accounts-repo.js' ;
import * as util from '../repo/general-repo.js' ;

const Logo = document.querySelector("#Himg");
const UserNameBox = document.querySelector("#userName");
const PassWordBox = document.querySelector("#password");
const ForgetPassword = document.querySelector("#FMP");
const LoginBtn = document.querySelector("#submitBtn");


AccountsRepo.getDB() ;

Logo.addEventListener('click',util.goHome ) ;
ForgetPassword.addEventListener('click', forgetPasswordHandler)
LoginBtn.addEventListener('click',handelLogIn);

async function handelLogIn(event){

    const form = event.target.form;
    const isFormValid = form.checkValidity();
    if(!isFormValid) return;


    event.preventDefault() ;
    let userName = UserNameBox.value ;
    let password = PassWordBox.value ;


    if(( await AccountsRepo.isAuthorized(userName,password)) ) {
        util.print("Correct");
        localStorage.username = userName ;
        console.log(userName)
        if (userName == "admin")
        {
            window.location.href = "./principal.html" ;
            return ;
        }
        window.location.href ="./applications.html" ;
    }
    else
    {
        util.print("Not Correct");
        document.querySelector('form').reset();
        alert("Incorrect Username or Password")
    }

}

//  Function to deal with forget Password situations
function forgetPasswordHandler(){
    alert("Please Contact The Admission Department at +974 4433 2211 ") ;
}


