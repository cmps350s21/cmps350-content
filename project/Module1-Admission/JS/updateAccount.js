import * as util from '../repo/general-repo.js' ;
import * as AccountsRepo from '../repo/accounts-repo.js'
import * as AppRepo from '../repo/applications-repo.js';

const Logo = document.querySelector("#Himg") ;
const FName = document.querySelector("#fname") ;
const LName = document.querySelector("#lname") ;
const NationalID = document.querySelector("#NID") ;
const HomePhone = document.querySelector("#homePhone") ;
const Mobile = document.querySelector("#mobile") ;
const Email = document.querySelector("#email") ;
const Occupation = document.querySelector("#Occupation") ;
const NameofEmployer = document.querySelector("#nameofEmp") ;
const NextBtn = document.querySelector("#submitBtn") ;
const Container = document.querySelector("#Container") ;
const Legend = document.querySelector("#Legend") ;


let step = 1 ;
let account = await AccountsRepo.getAccount(localStorage.username);

fillPage();

Logo.addEventListener('click', util.goMain ) ;
NextBtn.addEventListener('click',NextBtnHandler) ;

async function NextBtnHandler(event) {
    const form = event.target.form;
    const isFormValid = form.checkValidity();
    if(!isFormValid) return;

    event.preventDefault() ;
    await saveData() ;
    await fillPage();

}


// function that inject HTML and Fill the page depending on step
async function fillPage(){
    if(step == 1){
        Legend.innerHTML = "Step 1: Father personal information";
        FName.value = account.FatherFirstName  ;
        LName.value = account.FatherLastName  ;
        NationalID.value = account.FatherNationalID ;
        HomePhone.value = account.FatherHomePhone ;
        Mobile.value =account.FatherMobile ;
        Email.value = account.FatherEmail  ;
        Occupation.value = account.FatherOccupation  ;
        NameofEmployer.value = account.FatherNameofEmployer  ;
        step = step+ 1;
    } else if( step == 2) {
        Legend.innerHTML = "Step 2: Mother personal information";
        Legend.classList.add("focus")
        FName.value = account.MotherFirstName ;
        LName.value = account.MotherLastName ;
        NationalID.value = account.MotherNationalID ;
        HomePhone.value = account.MotherHomePhone =
        Mobile.value =account.MotherMobile  ;
        Email.value = account.MotherEmail ;
        Occupation.value = account.MotherOccupation;
        NameofEmployer.value = account.MotherNameofEmployer ;
        step = step+ 1;
    } else if ( step == 3){
        Legend.classList.remove("focus")
        Legend.innerHTML = "Step 3: Final account information (Credentials)";
        let x = document.querySelector("#fnameLabel") ;
        x.innerHTML = "User Name*: " ;
        let y =document.querySelector("#lnameLabel")
        LName.type = "password"  ;
        y.innerHTML = "Password*: " ;
        let z =document.querySelector("#NIDLabel")
        NationalID.type =  "password" ;
        z.innerHTML = "Repeat Password*: " ;
        for (let i =0 ; i<10; i++) {
            Container.children[8].remove()  ;
        }
        FName.value = account.UserName ;
        LName.value = account.Password ;
        NationalID.value = account.Password ;
        NextBtn.value = 'Save' ;
        step = step+ 1;
    }else if (step== -1) {

        await AccountsRepo.addAccount( account ) ;
        // may need to chgane in other DB for application
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!MUST
        // change application and link them to the nwe account
        await AppRepo.changeLink(localStorage.username, account.UserName)
        localStorage.username = account.UserName ;
        alert("Your account information has been updated successfully") ;
        window.location.href ="applications.html" ; // you can add a MSG that the account is created
    }

}



// function that saves the input data depending on step
async function saveData(){
    if (step ==2 ){
        account.FatherFirstName = FName.value ;
        account.FatherLastName = LName.value ;
        account.FatherNationalID = NationalID.value ;
        account.FatherHomePhone = HomePhone.value ;
        account.FatherMobile = Mobile.value ;
        account.FatherEmail = Email.value ;
        account.FatherOccupation = Occupation.value ;
        account.FatherNameofEmployer = NameofEmployer.value ;

    }else if( step == 3  ){
        account.MotherFirstName = FName.value ;
        account.MotherLastName = LName.value ;
        account.MotherNationalID = NationalID.value ;
        account.MotherHomePhone = HomePhone.value ;
        account.MotherMobile = Mobile.value ;
        account.MotherEmail = Email.value ;
        account.MotherOccupation = Occupation.value ;
        account.MotherNameofEmployer = NameofEmployer.value ;
    }else if(step == 4 ){
        // passwords Matches
        if( NationalID.value ===  LName.value ){
            // user names is unique
            await AccountsRepo.deleteAccount(localStorage.username) ;
            if(await AccountsRepo.uniqeUserName(FName.value) )
            {
                account.UserName= FName.value;
                account.Password = NationalID.value ;
                step = -1 ;
            }else{
                await AccountsRepo.addAccount(account) ;
                alert('This user name has already been used');
            }
        }
        else{
            alert('The passwords Do not match')
        }
    }
}

