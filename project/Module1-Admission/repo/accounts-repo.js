import {openDB, deleteDB} from 'https://unpkg.com/idb?module';

const dbName = 'admission-db';   // string, database name
const dbVersion = 1;   // integer, YOUR database version (not IndexedDB version)
const accountsStoreName = 'accounts';  // Name of your collection of documents
const applicationsStoreName = 'applications';  // Name of your collection of documents
const notesStoreName = 'notes'
const attachmentsStoreName = 'attachments'
const testsStoreName = 'tests'

export async function getDB() {
    const db = await openDB(dbName, dbVersion, {
            upgrade(db) {

                if (!db.objectStoreNames.contains(accountsStoreName)) {
                    const store = db.createObjectStore(accountsStoreName, {
                        keyPath: 'UserName', autoIncrement: false,
                    });
                }

                if (!db.objectStoreNames.contains(applicationsStoreName)) {
                    const store = db.createObjectStore(applicationsStoreName, {
                        keyPath: 'id', autoIncrement: true,
                    });
                    store.createIndex('accountsIndex', 'UserName');
                    store.createIndex('AYIndex', 'AY');
                }

                if (!db.objectStoreNames.contains(notesStoreName)) {
                    const store = db.createObjectStore(notesStoreName, {
                        keyPath: 'id', autoIncrement: true,
                    });
                    store.createIndex('noteIndex', 'applicationId');
                }

                if (!db.objectStoreNames.contains(attachmentsStoreName)) {
                    const store = db.createObjectStore(attachmentsStoreName, {
                        keyPath: 'id', autoIncrement: true,
                    });
                    store.createIndex('attachmentIndex', 'applicationId');
                }
                if (!db.objectStoreNames.contains(testsStoreName)) {
                    const store = db.createObjectStore(testsStoreName, {
                        keyPath: 'id', autoIncrement: true,
                    });
                    store.createIndex('testIndex', 'applicationId');
                }
            },
        }
    );
    /****************************************
     *** Init DB with data from JOSN file ***
     ****************************************/
    const accountsCount = await db.count(accountsStoreName);
    if (accountsCount === 0) {
        const accounts = await fetchinitalData( './data/accounts.json');
        for (const acc of accounts) {
            await db.add(accountsStoreName, acc);
        }
    }

    const applicationsCount = await db.count(applicationsStoreName);
    if (applicationsCount === 0) {
        const applications = await fetchinitalData('./data/applications.json');
        for (const app of applications) {
            await db.add(applicationsStoreName, app);
        }
    }

    const notesCount = await db.count(notesStoreName);
    if (notesCount === 0) {
        const notes= await fetchinitalData( './data/notes.json');
        for (const note of notes) {
            await db.add(notesStoreName, note);
        }
    }
    const attachmentsCount = await db.count(attachmentsStoreName);
    if (attachmentsCount === 0) {
        const attachments = await fetchinitalData( './data/attachments.json');
        for (const attachment of attachments) {
            await db.add(attachmentsStoreName, attachment);
        }
    }

    const testsCount = await db.count(testsStoreName);
    if (testsCount === 0) {
        const tests = await fetchinitalData( './data/tests.json');
        for (const test of tests) {
            await db.add(testsStoreName, test);
        }
    }

    return db;
}
async function fetchinitalData(url) {
    const response = await fetch(url);
    return await response.json();
}


export async function addAccount(account) {
    const db = await getDB();
    await db.add(accountsStoreName, account);
}

export async function uniqeUserName(username) {
    const db = await getDB();
    let exists = await db.get(accountsStoreName, username);
    return !exists;
}

export async function isAuthorized(username, password) {
    const db = await getDB();
    let exists = await db.get(accountsStoreName, username);
    if (exists) {
        return exists['Password'] == password;
    } else {
        return false;
    }
}

export async function getAccount(username) {
    const db = await getDB();
    return await db.get(accountsStoreName, username);
}

export async function deleteAccount(username) {
    const db = await getDB();
    await db.delete(accountsStoreName, username);
}

export async function getAdmin(){
    const db = await getDB();
    return await db.get(accountsStoreName, 'admin');
}

export async function updateAdmin(admin) {
    const db = await getDB();
    await db.put(accountsStoreName, admin);
}