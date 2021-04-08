import {openDB, deleteDB} from 'https://unpkg.com/idb?module';

const dbName = 'smms.db';
const dbVersion = 1;
const admissionsCollection = 'admissions';
const academicYearsCollection = 'academicYears';
const applicationStatusesCollection = 'admissionStatuses';

async function fetchAdmissions() {
    const url = '../data/admissions.json';
    const response = await fetch(url);
    return await response.json();
}

async function fetchAcademicYears() {
    const url = '../data/academicYears.json';
    const response = await fetch(url);
    return await response.json();
}

async function fetchAdmissionStatuses() {
    const url = '../data/applicationStatus.json';
    const response = await fetch(url);
    return await response.json();
}

async function getDB() {
    // Delete a database. Useful in development when you want to initialize your database schema.
    // await deleteDB(dbName);

    const db = await openDB(dbName, dbVersion, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(admissionsCollection)) {
                    const admissionsStore = db.createObjectStore(admissionsCollection, {
                        keyPath: 'id', autoIncrement: true,
                    });
                    // Creat an index for user unique email, to easily get the user Info by his email
                    admissionsStore.createIndex('admissionAuthorEmailIndex', 'author');
                }
                if (!db.objectStoreNames.contains(academicYearsCollection)) {
                    const academicYearsStore = db.createObjectStore(academicYearsCollection, {
                        keyPath: 'id', autoIncrement: true,
                    });
                    academicYearsStore.createIndex('openForAdmissionIndex', 'openForAdmission');
                }
                if (!db.objectStoreNames.contains(applicationStatusesCollection)) {
                    const admissionStatusesStore = db.createObjectStore(applicationStatusesCollection, {
                        keyPath: 'id', autoIncrement: true,
                    });
                }
            },
        }
    );

    /****************************************
     *** Init DB with data from JOSN file ***
     ****************************************/
    const admissionsCount = await db.count(admissionsCollection);
    if (admissionsCount === 0) {
        const admissions = await fetchAdmissions();
        for (const admission of admissions) {
            await db.add(admissionsCollection, admission);
        }
    }

    const academicYearsCount = await db.count(academicYearsCollection);
    if (academicYearsCount === 0) {
        const academicYears = await fetchAcademicYears();
        for (const academicYear of academicYears) {
            await db.add(academicYearsCollection, academicYear);
        }
    }

    const admissionStatusesCount = await db.count(applicationStatusesCollection);
    if (admissionStatusesCount === 0) {
        const admissionStatuses = await fetchAdmissionStatuses();
        for (const admissionStatus of admissionStatuses) {
            await db.add(applicationStatusesCollection, admissionStatus);
        }
    }
    return db;
}

/** Admissions functions */
export async function addAdmission(admission) {
    const db = await getDB();
    return await db.add(admissionsCollection, admission);
}

export async function getUserAdmissions(userEmail) {
    const db = await getDB();
    // Get all using the index to return objects where the admission Author Email = userEmail
    return await db.getAllFromIndex(admissionsCollection, 'admissionAuthorEmailIndex', userEmail);
}

export async function getAdmissionById(id) {
    const db = await getDB();
    return await db.get(admissionsCollection, id);
}

export async function getAllAdmissions() {
    const db = await getDB();
    return await db.getAll(admissionsCollection);
}

export async function updateAdmission(admission) {
    const db = await getDB();
    return await db.put(admissionsCollection, admission);
}

export async function withdrawAdmission(id) {
    const admission = await getAdmissionById(id);
    admission.status = 'Withdrawn';
    return await updateAdmission(admission);
}

export function setUpdateAdmissionId(id) {
    return localStorage.updateAdmissionId = id;
}

export function getUpdateAdmissionId() {
    return localStorage.updateAdmissionId;
}

export function removeUpdateAdmissionId() {
    return delete localStorage.updateAdmissionId;
}

/** Academic Years functions */
export async function addAcademicYear(AcademicYear) {
    const db = await getDB();
    return await db.add(academicYearsCollection, AcademicYear);
}

export async function getAllAcademicYears() {
    const db = await getDB();
    return await db.getAll(academicYearsCollection);
}

export async function getOpenForAdmissionYear() {
    const db = await getDB();
    const yearObject = await db.getFromIndex(academicYearsCollection, 'openForAdmissionIndex', 'true');
    return yearObject.year;
}

/** Application statuses functions */
export async function addApplicationStatuses(applicationStatuses) {
    const db = await getDB();
    return await db.add(applicationStatusesCollection, applicationStatuses);
}

export async function getAllApplicationStatuses() {
    const db = await getDB();
    return await db.getAll(applicationStatusesCollection);
}
