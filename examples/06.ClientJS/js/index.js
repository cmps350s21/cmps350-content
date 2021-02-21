//After the document is loaded in the browser
document.addEventListener("DOMContentLoaded", async () => {
    await handleInitPage();
});

/*****************************
    Functions to call Web API
 *****************************/
//region Web API Calls
async function getHeroes() {
    const url = './data/hero.json';
    const response = await fetch(url);
    return await response.json();
}

async function getHero(heroId) {
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

async function getHeroForm() {
    const url = `hero-form.html`;
    const response = await fetch(url);
    return await response.text();
}
//endregion

/*****************************
 Functions to handle UI Events
 *****************************/
//region UI Event Handlers
async function handleInitPage() {
    try {
        log(''); // Clear any error message displayed on the screen
        const heroes = await getHeroes();
        console.log(heroes);
        const heroesDiv = document.querySelector("#heroes");
        heroesDiv.innerHTML = heroes2Html(heroes);
    } catch (e) {
        log(e);
    }
}

async function handleUpdateHero(event, heroId) {
    event.preventDefault();
    //console.log("heroId:", heroId, event);

    const heroesDiv = document.querySelector("#heroes");
    const heroForm = await getHeroForm();
    heroesDiv.innerHTML = heroForm;

    const hero = await getHero(heroId);

    //Fill the form field with the hero data fetched from the Web API
    document.querySelector("#id").value = hero.id;
    document.querySelector("#name").value = hero.name;
    document.querySelector("#heroType").value = hero.heroType;
    document.querySelector("#quote").value = hero.quote;
}

async function handleAddHero(event) {
    event.preventDefault();
    log(''); // Clear any error message displayed on the screen
    const heroesDiv = document.querySelector("#heroes");
    const heroForm = await getHeroForm();
    heroesDiv.innerHTML = heroForm;
}

async function handleSubmitHero(event) {
    const form = event.target.form;
    const isFormValid = form.checkValidity();
    if (!isFormValid) return;

    //Prevent the submit button default behavior
    event.preventDefault();

    const hero = formToObject(form);
    console.log(hero);
    //ToDo: Make API call to add/update hero
    //return to the home page
    window.location.href = "index.html";
}

async function handleDeleteHero(id) {
    const confirmed = confirm(`Are you sure you want to delete hero #${id}?`);
    if (confirmed) {
        // ToDo: API call to delete hero by Id
        document.querySelector(`#row-${id}`).remove();
    }
}
//endregion


/*****************************
 Helper Functions
 *****************************/
//region Helper Functions
function formToObject(form) {
    // Construct key/value pairs representing form fields and their values,
    const formData = new FormData(form);
    let formObject = {};

    // Convert key/value pairs to an object
    formData.forEach( (value, key) => {
        formObject[key] = value;
    });

    return formObject;
}

function log(err) {
    if (err != '') {
        console.error(err);
    }
    const message = err.message || err;
    let messagesDev = document.querySelector("#errorMsg");
    messagesDev.innerHTML = message;
}

function heroes2Html(heroes) {
    const html = `
        <h2>Heroes</h2>
        <table id="heroesTable">
            ${ heroes.map( hero =>
            `<tr id="row-${hero.id}">
                <td>
                    <a href="#" onclick="handleUpdateHero(event, ${hero.id})">
                        ${hero.name}
                    </a>
                </td>
                <td> ${hero.heroType} </td>
                <td align="right">
                    ${hero.quote}
                </td>
                <td>
                    <i style="color: indianred; cursor: pointer" title="Delete hero" 
                        class="fas fa-user-times" onclick="handleDeleteHero(${hero.id})">
                    </i>
                </td>
            </tr>`).join('') 
            }
        </table>`;

    return html;
}
//endregion