<?php

function searchSafe(){
	// Write your code here:
  global $location, $moved_cupboard, $rounds_left;

  if ($location !== "kitchen" || !$moved_cupboard) {
    echo "You don't see any safe here!\n";
  } else {
    echo "You search through the safe (the passcode is \"1234\"). With baited breath, you pull out the contents! It's a chocolate Mickey Mouse, wrapped in gold foil. Delicious!\nYOU WIN THE GAME!!!!\n\n";
    $rounds_left = 1;
  }
  
}  