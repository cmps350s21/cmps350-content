let fetch = require('node-fetch');

// create a new "async" function so we can use the "await" keyword
async function getCountries(region) {
    let url = `https://restcountries.eu/rest/v1/region/${region}`;
    let response = await fetch( url );
    let countries = await response.json();
    return countries;
}

function displayCountries(region, countries) {
    console.log(`Countries in ${region} and their capital city:`);
    countries.map(country => {
        console.log(`${country.name} - ${country.capital}`);
    });
}

let region = 'asia';
getCountries(region)
    .then ( countries => displayCountries(region, countries) )
    .catch( err => console.log(err) );