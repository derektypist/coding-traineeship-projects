<?php
function generateStory($singular_noun,$verb,$color,$distance_unit) {
  $story = "\nThe {$singular_noun}s are lovely, {$color}, and deep.\nBut I have promises to keep,\nAnd {$distance_unit} to go before I {$verb},\nAnd {$distance_unit} to go before I {$verb}.\n";
  return $story;
}

echo generateStory("dog","eat","purple","7 furlongs");
echo generateStory("car","park","yellow","1 mile");
echo generateStory("document","print","white","2 pages");
