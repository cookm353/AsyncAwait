function main() {
    const numbers = new NumberFacts;
    numbers.sectionOne();
    numbers.sectionTwo();
    numbers.sectionThree();
    const cards = new Deck;
    cards.sectionOne();
    cards.sectionTwo();
}
main();
const deck = new Deck;
const $cardImg = $('img');
$('#hit-me').click(evt => {
    if (deck.cardsLeft >= 1) {
        deck.drawCard();
    }
});
