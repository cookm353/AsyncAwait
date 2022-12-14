class NumberFacts {
    url: string = "http://numbersapi.com"

    async sectionOne() {
        // Get a fact about a number
        const { data } = await axios.get(`${this.url}/7/trivia?json`)
        console.log(data.text)
    }

    async sectionTwo() {
        // Get a fact about multiple numbers
        let faveNumbersFacts = await Promise.all([
            axios.get(`${this.url}/7/trivia?json`),
            axios.get(`${this.url}/13/trivia?json`),
            axios.get(`${this.url}/42/trivia?json`)
        ])

        faveNumbersFacts.forEach(fact => console.log(fact.data.text))
    }

    async sectionThree() {
        // Get 4 facts about the same number
        let faveNumbersFacts = await Promise.all([
            axios.get(`${this.url}/42/trivia?json`),
            axios.get(`${this.url}/42/trivia?json`),
            axios.get(`${this.url}/42/trivia?json`)
        ])

        faveNumbersFacts.forEach(fact => console.log(fact.data.text))
    }
}

class Deck {
    _cardURL: string = "https://deckofcardsapi.com/api/deck/new/draw/?count="
    _deckURL: string = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    deckID: string
    cardsLeft = 52

    constructor() {
        this.getDeckID()
    }

    async getDeckID(): void {
        const { data } = await axios.get(this._deckURL)
        this.deckID = data.deck_id
    }
    
    getCardURL(numCards: number, deckID?: string): string {
        /* Generate the URL for requests based on the number of cards
        to be drawn and if there's a deck
        */
        let cardURL: string

        this.cardsLeft --

        if (deckID) {
            return `https://deckofcardsapi.com/api/deck/${this.deckID}/draw/?count=${numCards}`
        } else {
            return `https://deckofcardsapi.com/api/deck/new/draw/?count=${numCards}`
        }
    }

    async drawCard(): void {
        this.cardsLeft --
        const cardURL: string = `https://deckofcardsapi.com/api/deck/${this.deckID}/draw/?count=1`
        
        const { data } = await axios.get(cardURL)
        const imgURL: string = data.cards[0].images.svg

        $('img').attr('src', imgURL)
    }

    async sectionOne() {
        /*
        Draw a single card from a newly shuffled deck
        */
        const cardURL: string = this.getCardURL(1)
        const { data } = await axios.get(cardURL)
        const card = data.cards[0]

        console.log(`${card.value} of ${card.suit}`)
    }

    async sectionTwo() {
        /* 
        Draw a card from a newly shuffled deck, 
        then draw another from the same deck
        */
       
        let { data: cardData1 } = await axios.get(this.getCardURL(1, this.deckID))
        let { data: cardData2 } = await axios.get(this.getCardURL(1, this.deckID))

        let card1 = cardData1.cards[0]
        let card2 = cardData2.cards[0]

        console.log(`${card1.value} of ${card1.suit}`)
        console.log(`${card2.value} of ${card2.suit}`)
    }

}

interface PokemonInfo {
    pokemonName: string;
    pokemonURL: string;
}

interface PokemonFlavorText {
    pokemonName: string;
    pokemonFlavorText: string;
}

class Pokemon {
    baseURL: string = 'https://pokeapi.co/api/v2/pokemon/'
    speciesURL: string = 'https://pokeapi.co/api/v2/pokemon-species/'
    allPokemon: Array<PokemonInfo> = []

    constructor() {
        this.catchEmAll
    }

    catch(id: number): Promise<Object> {
        /* Make an API call for an individual Pokemon */
        return new Promise((resolve, reject) => {
            const resp: Promise<Object> = axios.get(`${this.baseURL}${id}`)

            resolve(resp)
            reject('Rejected!')
        })
    }

    catchEmAll() {
        /* Populate array with info on every Pokemon */
        const pokemonPromises: Array<Promise<Object>> = []
        
        for (let id = 1; id <= 905; id ++) {
            pokemonPromises.push(this.catch(id))
        }
        
        Promise.all(pokemonPromises)
            .then(resps => {
                resps.forEach(resp => {
                    const info: PokemonInfo = {
                        pokemonName: resp.data.name,
                        pokemonURL: `${this.baseURL}${resp.data.name}`
                    }
                    this.allPokemon.push(info)
                })
            })
            .catch(err => console.log(err))
    }

    getRandomIndex(): number {
        /* Generate a random index to pick a Pokemon */
        const min = 0
        const max = this.allPokemon.length - 1

        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    pick3(): void {
        /* Randomly select 3 Pokemon and display details */
        const pokemonDetails: Array<PokemonFlavorText> = []
        
        const pokemon1: PokemonInfo = this.allPokemon[this.getRandomIndex()]
        const pokemon2: PokemonInfo = this.allPokemon[this.getRandomIndex()]
        const pokemon3: PokemonInfo = this.allPokemon[this.getRandomIndex()]

        const pokemonList = [
            axios.get(`${this.speciesURL}${pokemon1.pokemonName}`),
            axios.get(`${this.speciesURL}${pokemon2.pokemonName}`),
            axios.get(`${this.speciesURL}${pokemon3.pokemonName}`)
        ]

        axios.get(`${this.speciesURL}${pokemon1.pokemonName}`)
            .then(resp => {
                const flavor_text = resp.data.flavor_text_entries[0].flavor_text
                console.log(pokemon1.pokemonName)
                console.log(flavor_text)
                return axios.get(`${this.speciesURL}${pokemon2.pokemonName}`)
            })
            .then(resp => {
                const flavor_text = resp.data.flavor_text_entries[0].flavor_text
                console.log(pokemon2.pokemonName)
                console.log(flavor_text)
                return axios.get(`${this.speciesURL}${pokemon3.pokemonName}`)
            })
            .then(resp => {
                console.log(pokemon3.pokemonName)
                const flavor_text = resp.data.flavor_text_entries[0].flavor_text
                console.log(flavor_text)
            })

        // return [pokemon1, pokemon2, pokemon3]
    }
}
