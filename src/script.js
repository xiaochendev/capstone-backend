import { showAlert, closeAlert } from './utils.js';

// Guest form
const guest = document.getElementById("guest");
const gUsername = guest.querySelector('[name="username"]');

guest.addEventListener("submit", guestValidate);
    
function guestValidate(e) {
    e.preventDefault();
    closeAlert();

    const guestNameVal = validateGuestName(); 

    if (!validateGuestName()) return false;

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

document.getElementById("closeErrorBtn").addEventListener("click", closeAlert);
