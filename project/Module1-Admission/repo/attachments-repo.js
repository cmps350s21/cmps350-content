// import { openDB, deleteDB } from 'https://unpkg.com/idb?module';
import {getDB} from './accounts-repo.js'



//
// const dbName = 'admission-db';   // string, database name
// const dbVersion = 1;   // integer, YOUR database version (not IndexedDB version)
const attachmentsStoreName = 'attachments';  // Name of your collection of documents
// //
// // async function getDB() {
// //
//     const db = await openDB(dbName, dbVersion, {
//             upgrade(db) {
//                 if (!db.objectStoreNames.contains(attachmentsStoreName)) {
//                     const store = db.createObjectStore(attachmentsStoreName, {
//                         keyPath: 'id', autoIncrement: true,
//                     });
//                     store.createIndex('attachmentIndex', 'applicationId');
//                 }
//             },
//         }
//     );
//     /****************************************
//      *** Init DB with data from JOSN file ***
//      ****************************************/
//     return db;
// }

// async function fetchinitalData() {
//     const url = './data/applications.json';
//     const response = await fetch(url);
//     return await response.json();
// }

export async function addAttachment(attachment){
    const db = await getDB();
    await db.add(attachmentsStoreName, attachment);
}

export async function getAllAttachments(appID) {
    const db = await getDB();
    return await db.getAllFromIndex(attachmentsStoreName, 'attachmentIndex', appID);
}
export async function deleteAttachment(attachment) {
    const db = await getDB();
    await db.delete(attachmentsStoreName, parseInt(attachment));
}