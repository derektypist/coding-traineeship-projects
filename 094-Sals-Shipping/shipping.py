weight = 80

# Ground Shipping
if weight <=2:
    cost_ground = (weight * 1.5) + 20
elif weight <=6:
    cost_ground = (weight * 3) + 20
elif weight <=10:
    cost_ground = (weight * 4) + 20
else:
    cost_ground = (weight * 4.75) + 20

print("Ground Shipping: ${0:.2f}".format(cost_ground))

# Ground Shipping Premium
cost_ground_premium = 125.00

print("Ground Shipping Premium: ${0:.2f}".format(cost_ground_premium))