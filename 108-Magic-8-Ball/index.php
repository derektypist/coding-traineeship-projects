<?php
function magic8Ball() {
  echo "Tell me... What is your question?\n";
  $question = readline(">");
  echo "\nHmm I see... Your question is $question... I understand why this weighs on you... I have consulted the spirit world.\nHere is your answer: ";
  $choice = rand(0,19);
  // echo $choice;
  switch ($choice) {
    case 0:
      echo "It is certain.\n";
      break;
    case 1:
      echo "It is decidedly so.\n";
      break;
    case 2:
      echo "Without a doubt.\n";
      break;
    case 3:
      echo "Yes - definitely.\n";
      break;
    case 4:
      echo "You may rely on it.\n";
      break;
    case 5:
      echo "As I see it, yes.\n";
      break;
    case 6:
      echo "Most likely.\n";
      break;
    case 7:
      echo "Outlook good.\n";
      break;
    case 8:
      echo "Yes.\n";
      break;
    case 9:
      echo "Signs point to yes.\n";
      break;
    case 10:
      echo "Reply hazy, try again.\n";
      break;
    case 11:
      echo "Ask again later.\n";
      break;
    case 12:
      echo "Better not tell you now.\n";
      break;
    case 13:
      echo "Cannot predict now.\n";
      break;
    case 14:
      echo "Concentrate and ask again.\n";
      break;
    case 15:
      echo "Don't count on it.\n";
      break;
    case 16:
      echo "My reply is no.\n";
      break;
    case 17:
      echo "My sources say no.\n";
      break;
    case 18:
      echo "Outlook not so good.\n";
      break;
    case 19:
      echo "Very doubtful.\n";
      break;
  }
}

magic8Ball();
magic8Ball();
magic8Ball();
