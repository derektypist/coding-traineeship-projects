const getSleepHours = day => {
  switch(day) {
    case 'Monday':
      return 9;
      break;
    case 'Tuesday':
      return 9;
      break;
    case 'Wednesday':
      return 9;
      break;
    case 'Thursday':
      return 9;
      break;
    case 'Friday':
      return 10;
      break;
    case 'Saturday':
      return 9;
      break;
    case 'Sunday':
      return 8;
      break;
    default:
      return 'Error';
    
  }
};

const getActualSleepHours = () => 
 getSleepHours('Monday') + getSleepHours('Tuesday') + getSleepHours('Wednesday') + getSleepHours('Thursday') + getSleepHours('Friday') + getSleepHours('Saturday') + getSleepHours('Sunday');

const getIdealSleepHours = () => {
  const idealHours = 9;
  return idealHours * 7;
}

const calculateSleepDebt = () => {
  const actualSleepHours = getActualSleepHours();
  const idealSleepHours = getIdealSleepHours();
  if (actualSleepHours === idealSleepHours) {
    console.log(`You have got the perfect amount of sleep.`);
  } else if (actualSleepHours > idealSleepHours) {
    console.log(`You have got ${actualSleepHours - idealSleepHours} hour(s) more sleep than needed.`);
  } else {
    console.log(`You got ${idealSleepHours - actualSleepHours} hour(s) less sleep than you needed this week.  Get some rest.`);
  }
}

calculateSleepDebt();