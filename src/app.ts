const pokemon = new Pokemon

function main(): void {
    const numbers = new NumberFacts
    numbers.sectionOne()
    numbers.sectionTwo()
    numbers.sectionThree()
    
    const deck = new Deck
    deck.sectionOne()
    deck.sectionTwo()
}

main()

$('#hit-me').click(evt => {
    if (deck.cardsLeft >= 1) {
        deck.drawCard()        
    }
})