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

const guest = document.getElementById("guest");
const gUsername = guest.querySelector('[name="username"]');

guest.addEventListener("submit", guestValidate);
    
function guestValidate(e) {
    e.preventDefault();

    const guestNameVal = validateGuestName();
    if (guestNameVal === false) {
        e.returnValue = false;
        return false;
    }

    const welcomeMessage = document.getElementById("welcomeMessage");
    const loading = document.getElementById("loading");

    welcomeMessage.textContent = `Welcome: ${guestNameVal}`;
    welcomeMessage.style.display = "block";
    loading.style.display = "block";

    setTimeout(() => {
        window.location.href = "./pages/flipCardGame.html";
    }, 1000);
    return true;
};

function validateGuestName(){
    if (gUsername.value === ""){
        showAlert("Please provide a username.")
        gUsername.focus();
        return false;
    }
    return gUsername.value;
}

function showAlert(message){
    document.getElementById("alertMessage").textContent = message;
    document.getElementById("errorDisplay").style.display = "block";
}

function closeAlert(){
    document.getElementById("errorDisplay").style.display = "none";
}

