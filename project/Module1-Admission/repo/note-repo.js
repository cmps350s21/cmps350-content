// import { openDB, deleteDB } from 'https://unpkg.com/idb?module';
import {getDB} from './accounts-repo.js'

// const dbName = 'admission-db';   // string, database name
// const dbVersion = 1;   // integer, YOUR database version (not IndexedDB version)
const notesStoreName = 'notes';  // Name of your collection of documents
//
// async function getDB() {
//
//     const db = await openDB(dbName, dbVersion, {
//             upgrade(db) {
//                 if (!db.objectStoreNames.contains(notesStoreName)) {
//                     const store = db.createObjectStore(notesStoreName, {
//                         keyPath: 'id', autoIncrement: true,
//                     });
//                     store.createIndex('noteIndex', 'applicationId');
//                 }
//             },
//         }
//     );
//     /****************************************
//      *** Init DB with data from JOSN file ***
//      ****************************************/
//     return db;
// }


export async function addNote(note){
    const db = await getDB();
    await db.add(notesStoreName, note);
}
export async function getAllNotes(appID) {
    const db = await getDB();
    return await db.getAllFromIndex(notesStoreName, 'noteIndex', appID);
}
export async function deleteNote(note) {
    const db = await getDB();
    await db.delete(notesStoreName, note);
}