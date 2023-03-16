<?php
  
function cookSoup(){
	// Write your code here:
  global $location, $has_mushrooms, $has_soup;
  if (!($location === "kitchen" && $has_mushrooms)) {
    echo "You can't cook like this! You need something to cook AND to be in the kitchen.\n";
  } else {
    echo "You made some mushroom soup. Mushroom is the queen of all soups!\n";
    $has_mushrooms = FALSE;
    $has_soup = TRUE;
  }
  
  
  
  
  
  
}