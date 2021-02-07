let person = {
    name: 'Samir Saghir',
    address: {
        city: 'Doha',
        street: 'University St'
    }
};

let { name, address: {city} } = person;
console.log(name, city);
