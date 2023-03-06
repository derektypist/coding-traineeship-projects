// Function to Get Random Number between min and max
export default (min, max) => {
    return Math.floor(Math.random() * max) + min;
};