const db = new Localbase('incidents.db')

createBase()

async function fetchStudents() {
    const url = './data/students.json';
    const response = await fetch(url);
    return await response.json();
}

async function fetchTeachers() {
    const url = './data/teachers.json';
    const response = await fetch(url);
    return await response.json();
}

async function fetchUsers() {
    const url = './data/login.json';
    const response = await fetch(url);
    return await response.json();
}

async function fetchLocations() {
    const url = './data/location.json';
    const response = await fetch(url);
    return await response.json();
}

async function fetchTypes() {
    const url = './data/type.json';
    const response = await fetch(url);
    return await response.json();
}

async function createBase() {
    if ((await db.collection('student').get()).length == 0) {
        const students = await fetchStudents()
        for (student of students) {
            db.collection('student').add(student)
        }
    }
    if ((await db.collection('teacher').get()).length == 0) {
        const teachers = await fetchTeachers()
        for (teacher of teachers) {
            db.collection('teacher').add(teacher)
        }
    }
    if ((await db.collection('user').get()).length == 0) {
        const users = await fetchUsers()
        for (user of users) {
            db.collection('user').add(user)
        }
    }
    if ((await db.collection('location').get()).length == 0) {
        const locations = await fetchLocations()
        for (loc of locations) {
            db.collection('location').add(loc)
        }
    }
    if ((await db.collection('type').get()).length == 0) {
        const types = await fetchTypes()
        for (type of types) {
            db.collection('type').add(type)
        }
    }
}

