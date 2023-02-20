const getActualSleepHours = () => 
8 + 7 + 10 + 10 + 9 + 11 + 8;

const getIdealSleepHours = idealHours => idealHours * 7;

const calculateSleepDebt = () => {
  const actualSleepHours = getActualSleepHours();
  const idealSleepHours = getIdealSleepHours(8);
  if (actualSleepHours === idealSleepHours) {
    console.log('Your sleep hours this week are ' + actualSleepHours + ' and the ideal sleep hours this week are ' + idealSleepHours + '.  You got the perfect amount of sleep.')
  } else if (actualSleepHours > idealSleepHours) {
    console.log('Your sleep hours this week are ' + actualSleepHours + ' and the total sleep hours this week are ' + idealSleepHours + '.  You got ' + (actualSleepHours - idealSleepHours) + ' hour(s) more sleep than you needed this week.');
  } else {
    console.log('Your sleep hours this week are ' + actualSleepHours + ' and the ideal sleep hours this week are ' + idealSleepHours + '.  You got ' + (idealSleepHours - actualSleepHours) + ' hour(s) less sleep than you needed this week.  Get some rest.');
  }
}

calculateSleepDebt();