# API Table

The aim is to provide an API Table of three APIs in Geonames.

## UX

Each API has a name (e.g. Ocean) and description.  There is a Submit Button to submit user inputs.

The description includes user inputs.  For example, in the Ocean API there is latitude and longitude.

The APIs are Ocean, Hierarchy and Siblings.

**Getting Started**

In the Ocean APIs enter the latitude (between -90 and 90) or just accept the default value (40.78343) and longitude (between -180 and 180) or just accept the selected value (e.g. -43.96625).  Select the Submit Button.  You will see the distance, geoname ID and name of ocean or sea.  If the ocean or sea cannot be found for this latitude and longitude, a message will appear instead.

In the Hierarchy APIs select the placename or attraction (e.g. Cambridge) from the dropdown list or just accept the selected value (e.g. Bromley).  Select the Submit Button.  You will see the names and feature codes.  For example, Bromley has names of Earth, Europe, United Kingdom, England, Greater London, Bromley, Bromley.  Its feature codes are AREA, CONT, PCLI, ADM1, ADM2, ADM3, PPLA3.

In the Sibling APIs select the country name (e.g. France) from the dropdown list or just accept the selected value (e.g. United Kingdom).  Select the Submit Button.  You will see the names and toponym names.

Repeat if needed.

**User Stories**

As a user, I can input the latitude and longitude or just accept the selected values.

As a user, I can select the placename or attraction or just accept the selected value.

As a user, I can select the country name or just accept the selected value.

As a user, if I hover over one of the Submit Buttons, the background colour changes.

As a user, if I select the Submit Button for the Ocean API, I can get the distance, geoname ID and name unless the ocean cannot be found.

As a user, if I select the Submit Button for the Hierarchy API, I can get the names and feature codes.

As a user, if I select the Submit Button for the Siblings API, I can get the names and toponym names.

**Information Architecture**

- Latitude is between -90 and 90
- Longitude is between -180 and 180
- Placenames or Attractions are Bromley, Beckenham, Chislehurst, London, Cambridge, Cambridge Railway Station, Manea, Menton, Torremolinos, La Bateria Park, Prague and Mustek
- Country Names are United Kingdom, France, Spain, Germany, Czechia, Portugal, Italy, Ireland, Netherlands, Russia and Turkey

## Features

Allows the user to input latitude and longitude in order to get the distance, geoname ID and name of ocean or sea.  Except when the ocean cannot be found for this latitude and longitude.

Allows the user to select placename or attraction from the dropdown list in order to get the names and feature codes.

Allows the user to select country name from the dropdown list in order to get the names and toponym names.

## Technologies

Uses HTML5, CSS3, JavaScript, jQuery, PHP.

## Deployment

Used IONOS to host the website.   

[Live Project](https://www.derekdhammaloka.co.uk/task)

A [YouTube Video](https://youtu.be/eRS3LCQJ2XA) is available to demonstrate various inputs for latitude and longitude (Ocean API), Placenames or Attractions (Hierarchy API) and Country Names (Siblings API).

## Credits

### Content

Written by me.

### Acknowledgements

- Nelson Dhlamini
- [Geonames](https://www.geonames.org)
- [Stack Overflow](https://www.stackoverflow.com)
- [IONOS](https://www.ionos.co.uk)
- [W3Schools.com](https://www.w3schools.com)
- [Google](https://www.google.co.uk)