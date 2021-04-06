import * as util from '../repo/general-repo.js';
import * as attachmentsRepo from "../repo/attachments-repo.js";

const attachmentInput = document.querySelector('#attachmentInput');
const addAttachment = document.querySelector('#addAttachment');
const attachmentsList = document.querySelector('#attachmentsList');
const Logo = document.querySelector('#Himg');


let appID = localStorage.getItem('applicationID')
Logo.addEventListener('click', util.goHome);
addAttachment.addEventListener('click', saveAttachment);

await loadAttachments();

attachmentInput.addEventListener("change", function () {
    const fileReader = new FileReader();
    //Once the file is read store its content in the localStorage
    fileReader.addEventListener("load", () => {
        const imageData = fileReader.result;
        localStorage.profileImage = imageData;
    });
    // Read the selected file as text
    fileReader.readAsDataURL(this.files[0]);
});

async function saveAttachment() {
    if (localStorage.getItem('profileImage') == null)
        return ;
    let attachment = {
        attachment: localStorage.getItem('profileImage'),
        applicationId: appID,
        writtenBy: localStorage.username == "admin" ? "admin" : "user"
    }
    await attachmentsRepo.addAttachment(attachment);
    // location.reload(); // prevent repeating notes list
    await loadAttachments()
    delete localStorage.profileImage;
}
async function loadAttachments() {
    let attachmentArray = []
    let attachments = await attachmentsRepo.getAllAttachments(appID)
    for (let attachment of attachments) {
        attachmentArray.push(attachment);
    }
    let htmlTxt = attachmentArray.map(attachment => toHtml(attachment)).join('');
    attachmentsList.innerHTML = `        <thead>
        <tr>
            <td>Attachment Number</td>
            <td>Attachment Name</td>
            <td>Delete</td>
        </tr>
        </thead>
        <tbody>
        <!-- inject here-->
        </tbody>`+htmlTxt;
}

function toHtml(attachment){
    let flag = (localStorage.username != "admin" && attachment.writtenBy == "admin");
    console.log(attachment.attachment)
    return `
    <tr> 
        <td>
            <h2>${attachment.id}</h2>
        </td>
        <td>
            <img src="${attachment.attachment}" alt="attachment" >
        </td>
        <td>
           <button onclick="DeleteAttach('${attachment.id}')" ${flag ? "disabled" : ""}> <i class="fa fa-trash"></i> Delete </button>
        </td>
    </tr>`
}

window.DeleteAttach = DeleteAttach ;
async function DeleteAttach(id){
    console.log("DELETE ATT")
    await attachmentsRepo.deleteAttachment(id) ;
    await loadAttachments();

}