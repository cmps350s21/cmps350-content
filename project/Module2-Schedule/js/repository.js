import {openDB} from 'https://unpkg.com/idb?module';

export const subjects = ["Math", "Science", "English","Arabic", "Islamic Studies", "Physics", "Chemistry"]
export const years = [2019, 2020, 2021]
export const grades = [1,2,3,4,5,6,7,8,9,10,11,12]
export const days = ["Sun", "Mon", "Tues", "Wed", "Thurs"]
export const fromtimes = ["8:00", "8:45", "9:30", "10:15", "10:45", "11:30", "12:15", "1:00"]
export const endtimes = ["8:00", "8:45", "9:30", "10:15", "10:45", "11:30", "12:15", "1:00"]


async function fetchSections() {
    const url = './data/section.json';
    const response = await fetch(url);
    return await response.json();
}

async function fetchTeachers() {
    const url = './data/teacher.json';
    const response = await fetch(url);
    return await response.json();
}

async function fetchStudents() {
    const url = './data/student.json';
    const response = await fetch(url);
    return await response.json();
}

async function fetchParents() {
    const url = './data/parent.json';
    const response = await fetch(url);
    return await response.json();
}

async function fetchPrincipal() {
    const url = './data/principal.json';
    const response = await fetch(url);
    return await response.json();
}

export async function getDB() {
const db = await openDB('SMS-db', 11, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('sections')) {
                 const sectionsStore = db.createObjectStore('sections', {
                    keyPath: 'id', autoIncrement: true,
                });

            }
            if (!db.objectStoreNames.contains('teachers')) {
                db.createObjectStore('teachers', {
                    keyPath: 'teacherId', autoIncrement: true,
                });

                if (!db.objectStoreNames.contains('students')) {
                    db.createObjectStore('students', {
                        keyPath: 'id', autoIncrement: true,
                    });
                }

                if (!db.objectStoreNames.contains('parents')) {
                    db.createObjectStore('parents', {
                        keyPath: 'parentID', autoIncrement: true,
                    });
                }
                if (!db.objectStoreNames.contains('principal')) {
                    db.createObjectStore('principal', {
                        keyPath: 'principalId', autoIncrement: true,
                    });
                }
            }
        },
    }
);
const sectionsCount = await db.count('sections');
if (sectionsCount === 0) {
    const sections = await fetchSections();
    for (const sec of sections) {
        await db.add("sections", sec);
    }
}
const teachersCount = await db.count('teachers');
    if (teachersCount === 0) {
        const teachers = await fetchTeachers();
        for (const teacher of teachers) {
            await db.add("teachers", teacher);
        }
    }
    const studentsCount = await db.count('students');
    if (studentsCount === 0) {
        const students = await fetchStudents();
        for (const student of students) {
            await db.add("students", student);
        }
    }

    const parentCount = await db.count('parents');
    if (parentCount === 0) {
        const parents = await fetchParents();
        for (const parent of parents) {
            await db.add("parents", parent);
        }
    }

    const principalCount = await db.count('principal');
    if (principalCount === 0) {
        const principal = await fetchPrincipal();

        await db.add("principal", principal);

    }
return db;
}

export async function getPrincipal(principalId){
    const db = await getDB()
    let principal = await db.get('principal',principalId)
    return principal
}

export async function getSections(year, grade) {
    const db = await getDB();
    let sections =await db.getAll('sections');
    if(year!=undefined && grade==undefined){
        return Object.values(sections).filter(sec => sec.year == year)
    }
    else if(year==undefined && grade !=undefined) {
        return Object.values(sections).filter(sec => sec.grade == grade)
    }
    else if(year!=undefined && grade !=undefined) {
        return filterSections(sections, year, grade)
    }
    else {
        return sections;
    }
}
export async function addSection(section) {
    delete section.id;
    const db = await getDB();
    const sectionId = await db.add('sections', section);
    console.log(sectionId)
    return sectionId;
}

export async function getStudents() {
    const db = await getDB();
    return await db.getAll('students');
}
export async function getStudent(studentId) {
    const db = await getDB();
    return await db.get("students", studentId)
}

export async function getStudentByStudentID(studentId){
    const db = await getDB()
    const students = await db.getAll("students")

    const student = Object.values(students).filter(student => student.studentID == studentId)[0]

    return student
}

export async function addStudent(student) {
    const db = await getDB();
    const studentId = await db.add('students', student);
    console.log(studentId)
    return studentId;
}
export async function updateStudent(student) {
    const db = await getDB();
    await db.put('students', student);
}

export async function deleteSection(sectionId) {
    const db = await getDB();
    await db.delete('sections', sectionId);
}
export async function deleteStudent(studentId) {
    // indexedDB.deleteDatabase('students');
    const db = await getDB();
    await db.delete('students', studentId);
}

function filterSections(sections, year, grade){
    console.log(sections)
    return Object.values(sections).filter(sec => sec.year == year && sec.grade == grade)
}
export async function getSection(sectionId) {
    const db = await getDB();
    return await db.get('sections', sectionId);
}
export async function getTeacher(teacherId) {
    const db = await getDB();
    return await db.get('teachers', teacherId);
}
export async function updateSection(section) {
    const db = await getDB();
    await db.put('sections',section)
}

export async function getTeachers() {
    const db = await getDB();
    return await db.getAll('teachers');

}

export async function getChildren(parentId){
    const db = await getDB()
    const students = await db.getAll('students');
    return students.filter(student => student.parentID === parentId)
}

export async function getParent(parentId) {
    const db = await getDB();
    return await db.get('parents', parentId);
}


export async function updateTeacher(teacher) {
    const db = await getDB();
    await db.put('teachers',teacher)
}

