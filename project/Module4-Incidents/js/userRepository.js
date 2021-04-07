const db = new Localbase('incidents.db')

export async function getStudents() {
    return await db.collection('student').get()
}

export async function getStudent(studentId) {
    return await db.collection('student').doc({id: studentId}).get()
}

export async function getTeachers() {
    return await db.collection('teacher').get()
}

export function studentToHTML(s) {
    return `<div class="involvedStudent" id="${s.id}">
                <p>Student ID:</p> 
                <input type="text" id="idBox" disabled value="${s.id}">
                <p>Student Name:</p> 
                <input type="text" id="nameBox" disabled value="${s.name}">
                <p>Student Grade:</p> 
                <input type="text" id="gradeBox" disabled value="${s.grade}">
                <i class="fa fa-minus" id="removebtn" onclick="removeStudent(${s.id})"></i>
            </div>`
}

export async function authenticate(username, password) {
    const users = await db.collection('user').get()
    const user = users.find(s => s.username === username && s.password === password);
    if (user != "undefined") {
        return user;
    } else {
        throw new Error("Authentication failed");
    }
}