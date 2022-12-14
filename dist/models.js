class NumberFacts {
    url = "http://numbersapi.com";
    async sectionOne() {
        // Get a fact about a number
        const { data } = await axios.get(`${this.url}/7/trivia?json`);
        console.log(data.text);
    }
    async sectionTwo() {
        // Get a fact about multiple numbers
        let faveNumbersFacts = await Promise.all([
            axios.get(`${this.url}/7/trivia?json`),
            axios.get(`${this.url}/13/trivia?json`),
            axios.get(`${this.url}/42/trivia?json`)
        ]);
        faveNumbersFacts.forEach(fact => console.log(fact.data.text));
    }
    async sectionThree() {
        // Get 4 facts about the same number
        let faveNumbersFacts = await Promise.all([
            axios.get(`${this.url}/42/trivia?json`),
            axios.get(`${this.url}/42/trivia?json`),
            axios.get(`${this.url}/42/trivia?json`)
        ]);
        faveNumbersFacts.forEach(fact => console.log(fact.data.text));
    }
}
class Deck {
    _cardURL = "https://deckofcardsapi.com/api/deck/new/draw/?count=";
    _deckURL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
    deckID;
    cardsLeft = 52;
    constructor() {
        this.getDeckID();
    }
    async getDeckID() {
        const { data } = await axios.get(this._deckURL);
        this.deckID = data.deck_id;
    }
    getCardURL(numCards, deckID) {
        /* Generate the URL for requests based on the number of cards
        to be drawn and if there's a deck
        */
        let cardURL;
        this.cardsLeft--;
        if (deckID) {
            return `https://deckofcardsapi.com/api/deck/${this.deckID}/draw/?count=${numCards}`;
        }
        else {
            return `https://deckofcardsapi.com/api/deck/new/draw/?count=${numCards}`;
        }
    }
    async drawCard() {
        this.cardsLeft--;
        const cardURL = `https://deckofcardsapi.com/api/deck/${this.deckID}/draw/?count=1`;
        const { data } = await axios.get(cardURL);
        const imgURL = data.cards[0].images.svg;
        $('img').attr('src', imgURL);
    }
    async sectionOne() {
        /*
        Draw a single card from a newly shuffled deck
        */
        const cardURL = this.getCardURL(1);
        const { data } = await axios.get(cardURL);
        const card = data.cards[0];
        console.log(`${card.value} of ${card.suit}`);
    }
    async sectionTwo() {
        /*
        Draw a card from a newly shuffled deck,
        then draw another from the same deck
        */
        let { data: cardData1 } = await axios.get(this.getCardURL(1, this.deckID));
        let { data: cardData2 } = await axios.get(this.getCardURL(1, this.deckID));
        let card1 = cardData1.cards[0];
        let card2 = cardData2.cards[0];
        console.log(`${card1.value} of ${card1.suit}`);
        console.log(`${card2.value} of ${card2.suit}`);
    }
}
class Pokemon {
    baseURL = 'https://pokeapi.co/api/v2/pokemon/';
    speciesURL = 'https://pokeapi.co/api/v2/pokemon-species/';
    allPokemon = [];
    constructor() {
        this.catchEmAll();
    }
    async catchEmAll() {
        /* Populate array with info on every Pokemon */
        for (let id = 1; id <= 905; id++) {
            let { data } = await axios.get(`${this.baseURL}${id}`);
            let info = {
                pokemonName: data.name,
                pokemonURL: `${this.baseURL}${data.name}`
            };
            this.allPokemon.push(info);
        }
    }
    getRandomIndex() {
        /* Generate a random index to pick a Pokemon */
        const min = 0;
        const max = this.allPokemon.length - 1;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    async pick3() {
        /* Randomly select 3 Pokemon and display details */
        const pokemon1 = this.allPokemon[this.getRandomIndex()];
        const pokemon2 = this.allPokemon[this.getRandomIndex()];
        const pokemon3 = this.allPokemon[this.getRandomIndex()];
        const pokeymans = await Promise.all([
            axios.get(`${this.speciesURL}${pokemon1.pokemonName}`),
            axios.get(`${this.speciesURL}${pokemon2.pokemonName}`),
            axios.get(`${this.speciesURL}${pokemon3.pokemonName}`)
        ]);
        for (let pokeyman of pokeymans) {
            console.log(pokeyman.data.name);
            console.log(pokeyman.data.flavor_text_entries[0].flavor_text);
        }
    }
}
