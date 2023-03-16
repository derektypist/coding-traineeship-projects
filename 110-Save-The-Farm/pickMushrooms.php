<?php
  
function pickMushrooms(){
	// Write your code here:
  global $location, $has_mushrooms;
  if ($location !== "woods") {
    echo "There aren't any mushrooms to pick!\n";
  } else {
    echo "You've picked some mushrooms.\n";
    $has_mushrooms = TRUE;
  }
   
}  