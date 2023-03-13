const nameRegex = /^[a-z ,.'-]+$/i;
const emailRegex = /.*/;
const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

// Page Elements
const nameElement = document.getElementById("nameInput");
const emailElement = document.getElementById("emailInput");
const dateElement = document.getElementById("dateInput");
const resultContainer = document.getElementById("resultContainer");
const result = document.getElementById("result");

// Returns local timezone date in the format: YYYY-MM-DD
function getLocalDate() {
    let date = new Date();
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset * 60 * 1000));
    return date.toISOString().split("T")[0];
}

// Shows error box
function showError(message) {
    resultContainer.style.display = "block";
    resultContainer.style.color = "red";
    result.innerHTML = "Error: " + message;
}

// Show submission confirmation
function showConfirmation() {
    resultContainer.style.display = "block";
    resultContainer.style.color = "black";
    result.innerHTML = "Submitted &#10004";
    nameElement.value = "";
    emailElement.value = "";
    dateElement.value = getLocalDate();
}

// Validates form input with regex's
function validate() {
    const name = nameElement.value;
    const email = emailElement.value;
    const date = dateElement.value;

    if (!name || !email || !date) {
        showError("A field cannot be empty!");
    }
    else if (!nameRegex.test(name)) {
        showError("Name is not in the correct format!");
    }
    else if (!emailRegex.test(email)) {
        showError("Email is not in the correct format!");
    }
    else if (!dateRegex.test(date)) {
        showError("Date is not in the correct format!");
    } else {
        showConfirmation();
    }
}

dateElement.value = getLocalDate();
