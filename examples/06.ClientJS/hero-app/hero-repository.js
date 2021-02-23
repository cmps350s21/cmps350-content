import { openDB, deleteDB } from 'https://unpkg.com/idb?module';

const dbName = 'heroes-db';   // string, database name
const dbVersion = 1;   // integer, YOUR database version (not IndexedDB version)
const heroesStoreName = 'heroes';  // Name of your collection of documents

async function fetchHeroes() {
    const url = './data/hero.json';
    const response = await fetch(url);
    return await response.json();
}

async function initDB() {
    /* Delete a database. Useful in development when
       you want to initialize your database schema. */
    //await deleteDB(dbName);

    const db = await openDB(dbName, dbVersion, {
            // This callback only runs ONE time per database version.
            // Use it to create object stores.
            upgrade(db) {
                // This is how we create object stores: bit complicated 😢
                if (!db.objectStoreNames.contains(heroesStoreName)) {
                    /* keyPath: specify the primary key for each object in the object store.
                       Set autoIncrement to true if you want IndexedDB to handle primary
                       key generation for you */
                    db.createObjectStore(heroesStoreName, {
                        keyPath: 'id', autoIncrement: true,
                    });
                }
            },
        },
    );
    /****************************************
     *** Init DB with data from JOSN file ***
     ****************************************/
    const heroesCount = await db.count(heroesStoreName);
    if (heroesCount === 0) {
        const heroes = await fetchHeroes();
        for (const hero of heroes) {
            await db.add(heroesStoreName, hero);
        }
    }
    return db;
}

export async function getHeroes() {
    const db = await initDB();
    return await db.getAll(heroesStoreName);
}

export async function getHero(heroId) {
    const db = await openDB(dbName, dbVersion);
    return await db.get(heroesStoreName, heroId);
}

export async function addHero(hero) {
    // Remove the hero id to ensure that the database will auto-assign an id
    delete hero.id;
    const db = await openDB(dbName, dbVersion);
    // Returns the id assigned by the database
    const heroId = await db.add(heroesStoreName, hero);
    return heroId;
}

export async function updateHero(hero) {
    const db = await openDB(dbName, dbVersion);
    await db.put(heroesStoreName, hero);
}

export async function deleteHero(heroId) {
    const db = await openDB(dbName, dbVersion);
    await db.delete(heroesStoreName, heroId);
}