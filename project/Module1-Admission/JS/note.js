import * as util from '../repo/general-repo.js';
import * as NoteRepo from "../repo/note-repo.js";

const noteTxt = document.querySelector('#note');
const addNote = document.querySelector('#addNote');
const noteList = document.querySelector('#noteList');
const visible = document.querySelector('#visible');
const Logo = document.querySelector('#Himg');

let appID = localStorage.getItem('applicationID')

Logo.addEventListener('click', util.goMain);
await loadNotes()

addNote.onclick = async () => {
    let note = {
        note: noteTxt.value,
        applicationId: appID,
        visible: visible == null ? true : visible.checked,
        writtenBy: localStorage.username == "admin" ? "admin" : "user"
    }
    await NoteRepo.addNote(note);
    await loadNotes()
    noteTxt.value = ''
    if(localStorage.username == "admin")
        visible.checked = false
}

export async function loadNotes() {
    let noteArray = []
    let notes = await NoteRepo.getAllNotes(appID)
    for (let note of notes) {
        if (localStorage.username == "admin" || note.visible == true)
            noteArray.push(note);
    }
    let htmlTxt = noteArray.map(note => toHtml(note)).join('');
    noteList.innerHTML = htmlTxt;
}

window.DeleteNote = DeleteNote;

async function DeleteNote(id) {
    if (!confirm("Do you want to delete this Note ?"))
        return;
    await NoteRepo.deleteNote(parseInt(id));
    await loadNotes();
}

function toHtml(note) {
    let flag = (localStorage.username != "admin" && note.writtenBy == "admin");
    let htmlTxt = `
    <tr> 
        <td>
            ${note.note}
        </td>
        <td>
            <button onclick="DeleteNote('${note.id}')" ${flag ? "disabled" : ""}> <i class="fa fa-trash"></i> Delete </button>
        </td>
    </tr>`
    return htmlTxt;
}

