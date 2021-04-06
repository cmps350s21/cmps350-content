import * as util from '../repo/general-repo.js';
import * as AppRepo from '../repo/applications-repo.js';
import * as AccountsRepo from '../repo/accounts-repo.js'

window.viewApp = viewApp;
window.editApp = editApp;
window.addNotes = addNotes;
window.addAttachments = addAttachments;
window.testView = testView;
window.withdraw = withdraw;
window.resubmit = resubmit;

const table = document.querySelector('tbody');
const Logo = document.querySelector('#Himg');


Logo.addEventListener('click', util.goMain);

await updatePage();

async function updatePage() {
    let appArray = []
    let username = localStorage.username;
    let apps = await AppRepo.getAllAplications(username);
    for (let app of apps) {
        appArray.push(app);
    }
    let htmlTxt = appArray.map(app => toHtml(app)).join('');
    table.innerHTML = htmlTxt;
}
async function viewApp(id) {
    localStorage.setItem('applicationID',id);
    util.view()
}

async function editApp(id) {
    localStorage.setItem('applicationID',id);
    let app = await AppRepo.getApplication(parseInt(id));
    if (app.Status != "Rejected" && app.Status!= "Accepted" && app.Status!= "Withdraw") {
        util.edit()
    }
    else{
        alert(`Application Number ${id} have been ${app.Status} So You Cannot modify it`)
    }
}

async function addNotes(id) {
    localStorage.setItem('applicationID',id);
    let app = await AppRepo.getApplication(parseInt(id));
    if (app.Status != "Rejected" && app.Status!= "Accepted" && app.Status!= "Withdraw" ) {
        util.note()
    }
    else{
        alert(`Application Number ${id} have been ${app.Status} So You Cannot modify it`)
    }
}

async function addAttachments(id) {
    localStorage.setItem('applicationID',id);
    let app = await AppRepo.getApplication(parseInt(id));
    if (app.Status != "Rejected" && app.Status!= "Accepted" && app.Status!= "Withdraw" ) {
        util.attachment()
    }
    else{
        alert(`Application Number ${id} have been ${app.Status} So You Cannot modify it`)
    }
}

async function testView(id){
    localStorage.setItem('applicationID',id);
    let app = await AppRepo.getApplication(parseInt(id));
    if (app.Status !== "Rejected" && app.Status!== "Accepted" && app.Status!= "Withdraw" ) {
        util.test()
    }
    else{
        alert(`Application Number ${id} have been ${app.Status} So You Cannot modify it`)
    }
}

async function withdraw(id) {
    let app = await AppRepo.getApplication(parseInt(id));
    if (app.Status != "Rejected" && app.Status!= "Accepted" && app.Status!= "Withdraw") {
        let result = confirm("Want to Withdraw?");
        if (result) {
            app.Status = "Withdraw";
            await AppRepo.updateApplication(app)
            location.reload();
        }
    }
    else{
        alert(`Application Number ${id} have been ${app.Status} So You Cannot modify it`)
    }
}

async function resubmit(id){
    let app = await AppRepo.getApplication(parseInt(id));
    let admin = await AccountsRepo.getAdmin() ;
    if (app.Status === "Rejected" || app.Status === "Withdraw" ){
        let application = app;
        application.AY = admin['CurrentAY'] ;
        application.date = Date.now() ;
        delete application.id;
        application.Status = "Submitted"
        await AppRepo.addApplication(application);
        location.reload()
    }
    else{
        alert(`You can resubmit Application Number ${id} only if it was Rejected`)
    }
}

function toHtml(app) {
    return `
       <tr>
            <td>${app.id}</td>
            <td>${app.AY} - ${app.AY+1} </td>
            <td>${new Date(app.date).toISOString().slice(0,10)}</td>
            <td >${app.Status}</td>
            <td class="eventColumn">
                <button onclick="viewApp('${app.id}')"><i class="fa fa-eye">View</i></button>&nbsp;
                <button onclick="editApp('${app.id}')"><i class="fa fa-edit">Edit</i></button>&nbsp;
                <button onclick="addNotes('${app.id}')"><i class="fa fa-plus">Add Notes</i></button>&nbsp;
                <button onclick="addAttachments('${app.id}')"><i class="fa fa-plus">Add Attachments</i></button>&nbsp;
                <button onclick="testView('${app.id}')"><i class="fa fa-eye">View Tests</i></button>&nbsp;
                <button onclick="withdraw('${app.id}')"><i class="fa fa-minus">Withdraw</i></button>&nbsp;
                <button onclick="resubmit('${app.id}')"
                ${app.Status === "Rejected" || app.Status === "Withdraw" ? "" :"disabled"}
                ><i class="fa fa-retweet">Resubmit</i></button>&nbsp;
            </td>
        </tr> 
    `
}

