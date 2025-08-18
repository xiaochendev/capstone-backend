// Helper functions
function showAlert(message) {
    document.getElementById("alertMessage").textContent = message;
    document.getElementById("errorDisplay").style.display = "flex";

}

function closeAlert() {
    document.getElementById("errorDisplay").style.display = "none";    
}

function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : {};
}

function saveUser(username, data) {
    const users = getUsers();
    users[username.toLowerCase()] = data;
    localStorage.setItem('users', JSON.stringify(users));
}

window.closeAlert = closeAlert;

export {showAlert, closeAlert, getUsers, saveUser};