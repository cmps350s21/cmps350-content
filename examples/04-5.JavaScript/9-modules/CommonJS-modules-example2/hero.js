class Hero {
    constructor(id, name, heroType, quote) {
        this.id = id;
        this.name = name;
        this.heroType = heroType;
        this.quote = quote;
    }
}

//Make Hero class available from other files
module.exports = Hero;