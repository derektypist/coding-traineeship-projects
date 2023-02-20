let raceNumber = Math.floor(Math.random() * 1000);
let registeredEarly = true;
let age = 18;
if (registeredEarly == true && age > 18) {
  raceNumber+= 1000;
}

if (registeredEarly == true && age > 18) {
  console.log(`You will race at 9:30 am.  Your race number is ${raceNumber}.`);
} else if (registeredEarly == false && age >18 ) {
  console.log(`You will race at 11:00 am.  Your race number is ${raceNumber}.`);
} else if (age < 18 && registeredEarly == true) {
  console.log(`You will race at 12:30 pm.  Your race number is ${raceNumber}.`);
} else if (age < 18 && registeredEarly == false ){
  console.log(`You will race at 12:30 pm.  Your race number is ${raceNumber}.`)
}

else {
  console.log('Go to the registration desk');
}
