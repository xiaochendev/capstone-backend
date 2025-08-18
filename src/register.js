import { showAlert, saveUser, getUsers } from './utils.js';

// Register form
const registration = document.getElementById('registration');
const rUsername = registration.elements['username'];
const rEmail = registration.elements['email'];
const rPassword = registration.elements['password'];
const rPasswordCheck = registration.elements['passwordCheck'];
const terms = registration.elements['terms'];


// Registration Form - Form Submission:
    // Usually, we would send this information to an external API for processing. In our case, we are going to process and store the data locally for practice purposes.
registration.addEventListener('submit', registrationVal);

function registrationVal(event) {
    event.preventDefault();

    if (!registerUsernameVal()) return false;
    if (!registerEmailVal()) return false;
    if (!registerPasswordVal()) return false;
    if (!termsVal()) return false;

    // If all validation is successful, store the username, email, and password using localStorage.
    const username = rUsername.value.trim().toLowerCase();
    const email = rEmail.value.trim().toLowerCase();
    const password = rPassword.value;

    saveUser(username, { email, password });

    // Clear all form fields after successful submission and show a success message.
    registration.reset();
    
    const alertMessage = document.getElementById("alertMessage");
    const errorDisplay = document.getElementById("errorDisplay");
    
    alertMessage.textContent = 'Registered successful!';    
    errorDisplay.style.display = 'block';

    return true;
}


// Registration Form - Username Validation:
function registerUsernameVal(){
    const value = rUsername.value.trim();
    const users = getUsers();
    // The username cannot be blank.
    if (!value) {
        showAlert("Username cannot be blank.", rUsername);
        return false;
    }
    // The username must be at least four characters long.
    if (value.length < 4) {
        showAlert("username must be at least four characters long.", rUsername);
        return false;
    }
    // The username must contain at least two unique characters.
    if (new Set(value).size < 2) {
        showAlert("username must contain at least two unique characters.", rUsername);
        return false;
    }
    // The username cannot contain any special characters or whitespace.
    if (/[^a-zA-Z0-9]/.test(value)) {
        showAlert("username cannot contain any special characters or whitespace.", rUsername);
        return false;
    }
    // The username already taken
    if (users[value.toLowerCase()]) {
        showAlert("username already taken.", rUsername);
        return false;
    }

    return true;
}

// Registration Form - Email Validation:
function registerEmailVal(){
    const value = rEmail.value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // The email must be a valid email address.
    if (!emailRegex.test(value)) {
        showAlert("email must be a valid email address.", rEmail);
        return false;
    }
    // The email must not be from the domain "example.com."
    if (value.endsWith('@example.com')) {
        showAlert("email must not be from the domain example.com.", rEmail);
        return false;
    }
    return true;
}

// Registration Form - Password Validation:
function registerPasswordVal(){
    const value = rPassword.value
    const check = rPasswordCheck.value;
    const username = rUsername.value.trim().toLowerCase();

    // Passwords must be at least 12 characters long.
    if (value.length <12) {
        showAlert("Passwords must be at least 12 characters long.", rPassword);
        return false;
    }
    // Passwords must have at least one uppercase and one lowercase letter.
    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
        showAlert("Passwords must have at least one uppercase and one lowercase letter.", rPassword);
        return false;
    }
    // Passwords must contain at least one number.
    if (!/\d/.test(value)) {
        showAlert("Passwords must contain at least one number.", rPassword);
        return false;
    }
    // Passwords must contain at least one special character.
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        showAlert("Passwords must contain at least one special character.", rPassword);
        return false;
    }
    // Passwords cannot contain the word "password" (uppercase, lowercase, or mixed).
    if (/password/i.test(value)) {
        showAlert("Password cannot contain the word password.", rPassword);
        return false;
    }
    // Passwords cannot contain the username.
    if (value.toLowerCase().includes(username)) {
        showAlert("Passwords cannot contain the username.", rPassword);
        return false;
    }
    // Both passwords must match.
    if (value !== check) {
        showAlert("Both passwords must match.", rPassword);
        return false;
    }
    return true;
}


// Registration Form - Terms and Conditions
function termsVal(){
    // The terms and conditions must be accepted.
    if (!terms.checked) {
        showAlert("You must accept the terms and conditions.", terms);
        return false;
    }
    return true;
}

document.getElementById("closeErrorBtn").addEventListener("click", closeAlert);
