let humanScore = 0;
let computerScore = 0;
let currentRoundNumber = 1;

// Write your code below:
function generateTarget() {
  return Math.floor(Math.random() * 10);
}

function compareGuesses(user,computer,target) {
  let humanClosestToTarget = Math.abs(user-target);
  let computerClosestToTarget = Math.abs(computer-target);
  return humanClosestToTarget <= computerClosestToTarget ? true : false;
}

function updateScore(winner) {
  winner == 'human' ? humanScore++ : computerScore++;
}

function advanceRound() {
  currentRoundNumber++;
}

