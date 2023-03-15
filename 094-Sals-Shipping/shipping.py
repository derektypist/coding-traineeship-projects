# Function to Calculate Ground Shipping
def groundshipping(weight):
    if weight <=2:
        cost_ground = (weight * 1.5) + 20
    elif weight <=6:
        cost_ground = (weight * 3) + 20
    elif weight <=10:
        cost_ground = (weight * 4) + 20
    else:
        cost_ground = (weight * 4.75) + 20
    return cost_ground

# Calculate and Print Ground Shipping with Weight of 8.4 pounds
print("Ground Shipping: ${0:.2f}".format(groundshipping(8.4)))

# Ground Shipping Premium
cost_ground_premium = 125.00

print("Ground Shipping Premium: ${0:.2f}".format(cost_ground_premium))

# Function to Calculate Drone Shipping

def droneshipping(weight):
    if weight <=2:
        cost_drone = (4.5 * weight)
    elif weight <=6:
        cost_drone = (9.00 * weight)
    elif weight <=10:
        cost_drone = (12.00 * weight)
    else:
        cost_drone = (14.25 * weight)
    return cost_drone

# Calculate and Print Drone Shipping with Weight of 1.5 pounds
print("Drone Shipping: ${0:.2f}".format(droneshipping(1.5)))

# Apply Two Examples - Printing and Formatting Costs to 2 Decimal Places
test1 = 4.8
test2 = 41.5
print("`nData with {0} pounds".format(test1))
print("Ground Shipping $ {0:.2f}".format(groundshipping(test1)))
print("Ground Shipping Premium $ {0:.2f}".format(cost_ground_premium))
print("Drone Shipping $ {0:.2f}".format(droneshipping(test1)))

print("\nData with {0} pounds".format(test2))
print("Ground Shipping $ {0:.2f}".format(groundshipping(test2)))
print("Ground Shipping Premium $ {0:.2f}".format(cost_ground_premium))
print("Drone Shipping $ {0:.2f}".format(droneshipping(test2)))