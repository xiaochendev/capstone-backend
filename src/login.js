import { getUsers, showAlert } from "./utils";

// Login Form 
const login = document.getElementById('login');
const lUsername = login.elements['username'];
const lPassword = login.elements['password'];
const keepLoggedIn = login.elements['persist']
const errorDisplay = document.getElementById('errorDisplay');


login.addEventListener('submit', loginValidate)

function loginValidate(event){
    event.preventDefault();

    if (!loginUsernameVal()) return false;
    if (!loginPasswordVal()) return false;

    login.reset();
    
    // If all validation is successful, clear all form fields and show a success message.
    // If "Keep me logged in" is checked, modify the success message to indicate this (normally, this would be handled by a variety of persistent login tools and technologies).

    const message = keepLoggedIn.checked 
        ? 'Login successful! Keep me logged in is checked.' 
        : 'Login successful!';

    showAlert(message);

    return true;
}


// Login Form - Username Validation:
function loginUsernameVal(){
    const value = lUsername.value.trim();
    const users = getUsers();
    
    // The username cannot be blank.
    if (!value) {
        showAlert("// The username cannot be blank.");
        return false;
    }

    // The username must exist (within localStorage). Remember that usernames are stored in all lowercase, but the username field accepts (and should not invalidate) mixed-case input.
    if (!users[value.toLowerCase()]){
        showAlert("The username does not exist.");
        return false;
    }

    return true;
}

function loginPasswordVal(){
    const username = lUsername.value.trim().toLowerCase();
    const pass = lPassword.value;
    const users = getUsers();

    // The password cannot be blank.
    if (!pass) {
        showAlert("The password cannot be blank.");
        return false;
    }
    // The password must be correct (validate against localStorage).
    if (users[username].password !== pass) {
        showAlert("Password is incorrect.");
        return false;
    }
    return true;
}

// closeErrorBtn
const closeBtn = document.getElementById('closeErrorBtn');
closeBtn.addEventListener('click', () => {
  errorDisplay.style.display = 'none';
});