import {openDB, deleteDB} from 'https://unpkg.com/idb?module';

const dbName = 'sms.db';
const dbVersion = 1;
const usersCollection = 'users';

async function fetchUsers() {
    const url = '../data/users.json';
    const response = await fetch(url);
    return await response.json();
}

async function getDB() {
    // Delete a database. Useful in development when you want to initialize your database schema.
    // await deleteDB(dbName);

    const db = await openDB(dbName, dbVersion, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(usersCollection)) {
                    const usersStore = db.createObjectStore(usersCollection, {
                        keyPath: 'id', autoIncrement: true,
                    });
                    // Creat an index for user unique email, to easily get the user Info by his email
                    usersStore.createIndex('usersEmailIndex', 'email');
                }
            },
        }
    );

    /****************************************
     *** Init DB with data from JOSN file ***
     ****************************************/
    const usersCount = await db.count(usersCollection);
    if (usersCount === 0) {
        const users = await fetchUsers();
        for (const user of users) {
            await db.add(usersCollection, user);
        }
    }
    return db;
}

export async function registerUser(registrationForm) {
    const db = await getDB();
    return await db.add(usersCollection, registrationForm);
}

export async function getUserByEmail(userEmail) {
    const db = await getDB();
    // Get all using the index to return objects where the admission Author Email = userEmail
    return await db.getFromIndex(usersCollection, 'usersEmailIndex', userEmail);
}

export async function getUserById(id) {
    const db = await getDB();
    return await db.get(usersCollection, id);
}

export async function updateUser(registrationForm) {
    const db = await getDB();
    return await db.put(usersCollection, registrationForm);
}

export function setCurrentUser(email) {
    return localStorage.currentUserEmail = email;
}

export function setCurrentRole(role) {
    return localStorage.currentUserRole = role;
}

export function getCurrentUser() {
    return localStorage.currentUserEmail;
}

export function getCurrentRole() {
    return localStorage.currentUserRole;
}

export function setUpdateUserId(id) {
    return localStorage.updateUserId = id;
}

export function getUpdateUserId() {
    return localStorage.updateUserId;
}

export function removeUpdateUserId() {
    return delete localStorage.updateUserId;
}

export function logOutCurrentUser() {
    return delete localStorage.currentUserEmail && delete localStorage.currentUserRole;
}



