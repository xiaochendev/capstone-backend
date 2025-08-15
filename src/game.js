// Cache at least one element using selectElementById.
// Cache at least one element using querySelector or querySelectorAll.
// Use the parent-child-sibling relationship to navigate between elements at least once (firstChild, lastChild, parentNode, nextElementSibling, etc.).
// Iterate over a collection of elements to accomplish some task.
// Create at least one element using createElement.
// Use appendChild and/or prepend to add new elements to the DOM.
// Use the DocumentFragment interface or HTML templating with the cloneNode method to create templated content. 
// Modify the HTML or text content of at least one element in response to user interaction using innerHTML, innerText, or textContent.
// Modify the style and/or CSS classes of an element in response to user interactions using the style or classList properties.
// Modify at least one attribute of an element in response to user interaction.
// Register at least two different event listeners and create the associated event handler functions.
// Use at least two Browser Object Model (BOM) properties or methods.
// Include at least one form and/or input with HTML attribute validation.
// Include at least one form and/or input with DOM event-based validation. (This can be the same form or input as the one above, but should include event-based validation in addition to the HTML attribute validation.)

// 24 cards; 6 x 4 grids
const cards = ["😘","😘","😘", "👽", "👿", "🖖🏿", "👀", "👁️", "✊", "👻","😘", "👽", "👿", "🖖🏿", "👀", "👁️", "✊", "👻", "🎲", "🎲", "🎲", "🎲", "🎲","🎲"];

// shuffle cards => use for restart game too
let shuffledCards = cards.sort(() => 0.5 - Math.random());

const gameBoard = document.getElementById("game-board");
let flipped = [];
let lockBoard = false;

function createCard(cards){
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <div class="card-inner">
        <div class="card-front">|||||</div>
        <div class="card-back">${cards}</div>
    </div>
    `;

    card.addEventListener('click', () => {
        if (lockBoard || card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        flipped.push(card);

        // when flipped two cards
        if (flipped.length === 2){
            lockBoard = true;
            const [first, second] = flipped;

            const card1 = first.querySelector('.card-back').textContent;
            const card2 = second.querySelector('.card-back').textContent;
            // shown if matched
            if (card1 == card2) {
                flipped = [];
                lockBoard = false;
            } else {
                // hidden if no matched
                setTimeout(() => {
                    first.classList.remove('flipped');
                    second.classList.remove('flipped');
                    flipped = [];
                    lockBoard = false;
                }, 1000);
            }
        }
    });
    gameBoard.appendChild(card);
}

//create cards for each card
shuffledCards.forEach(card => createCard(card));


//return home when exit
const exitBtn = document.getElementById("exitBtn");
exitBtn.addEventListener("click", function() {
    window.location.href = "../index.html";
});

//restart game
const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", function(){
    window.location.href = "./flipCardGame.html";
})