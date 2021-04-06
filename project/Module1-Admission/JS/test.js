import * as testRepo from '../repo/tests-repo.js'

const subject = document.querySelector('#subject')
const testDate = document.querySelector('#testDate')
const Result = document.querySelector('#Result')
const comment = document.querySelector('#comment')
const addTestBtn = document.querySelector('#addTest')
const testList = document.querySelector('#testBody')

if(addTestBtn)
    addTestBtn.addEventListener('click', saveTest)

let appID = localStorage.getItem('applicationID')
let toUpdate = false;
let toUpdateId = -1;

window.updateTest = updateTest

await loadTests()

async function saveTest(event) {
    const form = event.target.form;
    const isFormValid = form.checkValidity();
    if(!isFormValid) return;

    event.preventDefault() ;
    let test = {
        subject: subject.value,
        testDate: testDate.value,
        Result: Result.value != "" ? Result.value : "Test Not Graded Yet",
        comment: comment.value != "" ? comment.value : "No Comment",
        applicationId: appID
    }
    console.log(toUpdate)
    if (toUpdate) {
        test.id = toUpdateId
        await testRepo.updateTest(test);
        toUpdateId = -1;
        toUpdate = false;
    } else {
        await testRepo.addTest(test);
    }
    await loadTests()
    subject.value = ''
    testDate.value = ''
    Result.value = ''
    comment.value = ''

}


async function loadTests() {
    let testArray = []
    let tests = await testRepo.getAllTest(appID)
    for (let test of tests) {
        testArray.push(test);
    }
    let htmlTxt = testArray.map(test => toHtml(test)).join('');
    testList.innerHTML = htmlTxt;
}

async function updateTest(id) {
    let test = await testRepo.getTest(parseInt(id))
    subject.value = test.subject;
    testDate.value = test.testDate;
    Result.value = (test.Result == "Test Not Graded Yet") ? "" : test.Result;
    comment.value = (test.comment == "No Comment") ? "" : test.comment;
    toUpdate = true;
    toUpdateId = parseInt(id)
}

function toHtml(test) {
    let htmlTxt = `
    <tr> 
        <td>
            ${test.id}
        </td>
        <td>
            ${test.subject}
        </td>
        <td>
            ${test.testDate}
        </td>
        <td>
            ${test.Result}
        </td>
        <td>
            ${test.comment}
        </td>
        ${localStorage.username == "admin" ? `<td><button onclick="updateTest(${test.id})">Update</button>\n</td>` : ""}
    </tr>`
    return htmlTxt;
}