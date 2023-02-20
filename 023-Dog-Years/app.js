// Define myAge
let myAge = 54;

// Define earlyYears
let earlyYears = 2;

earlyYears *= 10.5;
myAge -= 2;

// Define laterYears
let laterYears = myAge;

// Multiply laterYears by 4
laterYears *= 4;

console.log(`Early Years is ${earlyYears}`);
console.log(`Later Years is ${laterYears}`);

// Define myAgeInDogYears
let myAgeInDogYears = earlyYears + laterYears;

// Define myName and Convert to Lower Case
let myName = 'Derek';
myName.toLowerCase();

// String Interpolation
console.log(`My name is ${myName}.  I am ${myAge} years old in human years which is ${myAgeInDogYears} years old in dog years.`);