async function fetchHeroes() {
    const url = './data/hero.json';
    const response = await fetch(url);
    return await response.json();
}

export async function getHeroes() {
    if (!localStorage.heroes) {
        const heroes = await fetchHeroes();
        localStorage.heroes = JSON.stringify(heroes);
        return heroes;
    }
    return JSON.parse(localStorage.heroes);
}

export async function getHero(heroId) {
    const heroes = await this.getHeroes();
    const hero = heroes.find(h => h.id == heroId);
    //console.log("getHero(heroId)", hero)
    if (hero) {
        return hero;
    }
    else {
        throw "Not found";
    }
}

export function addHero(hero) {
    let heroes;
    if (localStorage.heroes === null) {
        heroes = [];
    } else {
        heroes = JSON.parse(localStorage.heroes);
    }

    //Get the last Id used +1
    let maxId = Math.max( ...heroes.map(h => h.id) ) + 1;
    console.log("maxId", maxId);

    hero.id = maxId;
    heroes.push(hero);
    localStorage.heroes = JSON.stringify(heroes);
}

export function updateHero(hero) {
    let heroes;
    if (localStorage.heroes === null) {
        heroes = [];
    } else {
        heroes = JSON.parse(localStorage.heroes);
    }

    // Look for the hero to be updated then update it
    const foundIndex = heroes.findIndex(h => h.id == hero.id);
    //console.log("heroRepository.updateHero.foundIndex", foundIndex, hero.id)

    if (foundIndex >= 0) {
        heroes[foundIndex] = hero;
        localStorage.heroes = JSON.stringify(heroes);
    }
}

export function deleteHero(heroId) {
    let heroes;
    if (localStorage.heroes === null) {
        heroes = [];
    } else {
        heroes = JSON.parse(localStorage.heroes);
    }

    // Look for the hero to be deleted then remove it
    const foundIndex = heroes.findIndex(h => h.id == heroId);

    if (foundIndex >= 0) {
        heroes.splice(foundIndex, 1);
        localStorage.heroes = JSON.stringify(heroes);
    }
}