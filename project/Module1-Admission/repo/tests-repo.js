// import { openDB, deleteDB } from 'https://unpkg.com/idb?module';
import {getDB} from './accounts-repo.js'

// const dbName = 'admission-db';   // string, database name
// const dbVersion = 1;   // integer, YOUR database version (not IndexedDB version)
const testsStoreName = 'tests';  // Name of your collection of documents
//
// async function getDB() {
//
//     const db = await openDB(dbName, dbVersion, {
//             upgrade(db) {
//                 if (!db.objectStoreNames.contains(testsStoreName)) {
//                     const store = db.createObjectStore(testsStoreName, {
//                         keyPath: 'id', autoIncrement: true,
//                     });
//                     store.createIndex('testIndex', 'applicationId');
//                 }
//             },
//         }
//     );
//     /****************************************
//      *** Init DB with data from JOSN file ***
//      ****************************************/
//     return db;
// }


export async function addTest(test){
    const db = await getDB();
    await db.add(testsStoreName, test);
}
export async function getTest(id){
    const db = await getDB();
    return await db.get(testsStoreName, id);
}
export async function updateTest(test){
    const db = await getDB();
    await db.put(testsStoreName, test);
}
export async function getAllTest(appID) {
    const db = await getDB();
    return await db.getAllFromIndex(testsStoreName, 'testIndex', appID);
}
