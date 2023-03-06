// Function to Capitalize First Letter
function capitalizeFirstLetter(str) {
    // Check if str does not include hyphen
    return (!str.includes("-")) ? str[0].toUpperCase() + str.slice(1) : str.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join("-");
}

export default capitalizeFirstLetter;