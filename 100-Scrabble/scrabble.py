letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
letters_lower = [letter.lower() for letter in letters]
letters_all = letters + letters_lower
points = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 4, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10]
points_lower = [point for point in points]
points_all = points + points_lower
letter_to_points = {key:value for key, value in zip(letters_all, points_all)}
letter_to_points[" "] = 0
def score_word(word):
  point_total = 0
  for letters in word:
    point_total += letter_to_points.get(letters, 0)
  return point_total
brownie_points = score_word("BROWNIE")
print(brownie_points)  
player_to_words = {"player1": ["BLUE", "TENNIS", "EXIT"], "wordNerd": ["EARTH","EYES", "MACHINE"], "Lexi Con": ["ERASER", "BELLY", "HUSKY"], "Prof Reader": ["ZAP", "COMA", "PERIOD"]}
player_to_points = {}
for player, words in player_to_words.items():
  player_points = 0
  for word in words:
    player_points += score_word(word)
  player_to_points[player] = player_points

print(player_to_points)
score_for_Court = score_word("Court")
print(score_for_Court)
print(score_word("brownie"))
print(score_word("Brownie"))