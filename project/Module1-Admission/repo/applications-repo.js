// import { openDB, deleteDB } from 'https://unpkg.com/idb?module';
import {getDB} from './accounts-repo.js'
// const dbName = 'admission-db';   // string, database name
// const dbVersion = 1;   // integer, YOUR database version (not IndexedDB version)
const applicationsStoreName = 'applications';  // Name of your collection of documents

// async function getDB() {
//
//     const db = await openDB(dbName, dbVersion, {
//             upgrade(db) {
//                 if (!db.objectStoreNames.contains(applicationsStoreName)) {
//                     const heroesStore = db.createObjectStore(applicationsStoreName, {
//                         keyPath: 'id', autoIncrement: true,
//                     });
//                     heroesStore.createIndex('accountsIndex', 'UserName');
//                 }
//             },
//         }
//     );
//     /****************************************
//      *** Init DB with data from JOSN file ***
//      ****************************************/
//     // const applicationsCount = await db.count(applicationsStoreName);
//     // if (applicationsCount === 0) {
//     //     const applications = await fetchinitalData();
//     //     for (const app of applications) {
//     //         await db.add(applicationsStoreName, app);
//     //     }
//     // }
//     return db;
// }

// async function fetchinitalData() {
//     const url = './data/applications.json';
//     const response = await fetch(url);
//     return await response.json();
// }

export async function addApplication(app){
    const db = await getDB();
    await db.add(applicationsStoreName, app);
}

export async function getAllAplications(username) {
    const db = await getDB();
    return await db.getAllFromIndex(applicationsStoreName, 'accountsIndex', username);
}

export async function updateApplication(app){
    const db = await getDB();
    await db.put(applicationsStoreName, app);
}

export async function getApplication(id){
    const db = await getDB();
    return await db.get(applicationsStoreName, id);
}

export async function changeLink( oldUsername , newUsername ){
    if(oldUsername == newUsername)
        return ;

    let changed = await getAllAplications(oldUsername) ;
    // console.log(changed)

    for(let temp of changed) {
        temp.UserName = newUsername;
        await updateApplication(temp);
   }
}

export async function getAllApps(){
    const db = await getDB();
    return await db.getAll(applicationsStoreName);

}

export async function getPastThreeApps(num){
    const db = await getDB();
    let returner = [
        ...await db.getAllFromIndex(applicationsStoreName, 'AYIndex', num),
        ...await db.getAllFromIndex(applicationsStoreName, 'AYIndex', num-1),
        ...await db.getAllFromIndex(applicationsStoreName, 'AYIndex', num-2)
    ]
    return returner;
}