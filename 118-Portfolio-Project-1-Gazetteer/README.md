# Gazetteer Project

The aim is to provide an interactive map with the capabilities of searching a country, place or attraction (e.g. park).

## UX

**User Stories**

As a user, I expect country information to include at least name, capital city, population and currency information.

As a user, I expect current and future weather.

As a user, I expect exchange information.

**Getting Started**

This project checks for Geolocation.  Acknowledge any alerts.

When Geolocation has been enabled, the dropdown list for Select A Country is Updated.  For example, if the user's location is United Kingdom, then United Kingdom is the current selection in the Select a Country dropdown list.

- Select Get Country Information to Display Country Information (e.g. Name of Country)

- Select Exchange Information to Get Exchange Information.  Allows user input of number of US Dollars (0-500) and Desired Currency (Default is the Currency of the user's location - for example, if the user's location is United Kingdom, the default currency is GBP).

- Select Current Weather to get Current Weather.

- Select Future Weather to get Future Weather.  Up to 40 readings every 3 hours.

- Select Nearby Wikipedia to get Nearby Wikipedia.

- Select Nearby Placename to get Nearby Placename.

- Select Timezone Information to get Timezone Information.

You can also search by name of country, city, town, village or landmark (e.g. library, railway station, park).

In the dropdown list, you can select a country (e.g. Australia).  This gives any earthquakes, wikipedia articles, weather observations and cities.  Hover over one of the icons to get a brief description.  For example, in the weather observations - name of weather station.

**Information**

- [Current Forecast on Open Weather](Data/openweathercurrent.pdf)
- [Future Forecasts on Open Weather](Data/openweatherfuture.pdf)
- [Open Exchange Rates](Data/openexchangerates.pdf)
- [Open Cage Data for United Kingdom](Data/opencageunitedkingdom.pdf)
- [UK Cities](Data/ukcities.pdf)

An example of the current weather for Prees, GB (United Kingdom) was taken on 22 June 2023.  Metric Units are applied.

![Current Weather Example](Data/examplecurrentweather.PNG)

An example of the future weather forecast for Odda, NO (Norway) was taken on 27 June 2023.  Metric Units are applied.

![Future Weather Example](Data/examplefutureweather.PNG)

An example of country information for Poland was taken on 27 June 2023.

![Country Information for Poland on 27 June 2023](Data/examplecountryinfo.PNG)

An example of nearby placename with county name omitted on 27 June 2023.

![Nearby Placename Example - County Name Omitted](Data/exampleplacename.PNG)

An example of nearby placename with county name shown on 30 June 2023.

![Nearby Placename Example - County Name Shown](Data/exampleplacenamewithcounty.png)

An example of the description of an earthquake in Norway

![Description of an earthquake](Data/earthquakedescription.png)

An example of hovering over an earthquake

![Hovering Over an Earthquake](Data/earthquakehovering.png)

An example of the population of a city.  For illustration purposes only.

![Population of A City](Data/examplecity.png)

An example of Timezone Information on 20 June 2023.

![Timezone Information](Data/exampletimezoneinformation.png)

An example of a Weather Observation

![Weather Observation](Data/exampleweatherobservation.png)

An Example of Nearby Wikipedia

![Nearby Wikipedia](Data/nearbywikipediaexample.png)

An Example of Sea or Ocean (Taken on 4 July 2023)

![Sea or Ocean](Data/northsea.png)

## Features

- Select A Country (e.g. United Kingdom)
- Search a Country, City, Town, Village or Landmark (e.g. Railway Station, Library)
- Get Information on a Country (e.g. Name of Country, Capital City, Population)
- Get Exchange Information (e.g. US Dollars to British Pounds)
- Get Current Weather
- Get Future Weather (Up to 5 days)
- Get Nearby Wikipedia (Up to 100 Articles)
- Get Nearby Placename (can include Landmark)
- Get Timezone Information
- Earthquakes (on Map)
- Wikipedia Articles (on Map)
- Weather Observations (on Map)
- Cities (with Population and Wikipedia Article, on Map)

Other features that would be added include Points of Interest (POI) and News.

## Technologies

HTML5, CSS3, JavaScript, jQuery, Font Awesome, Bootstrap, PHP, LeafletJS with GeoSearch, Easy Button and Marker Clusters.

## Deployment

Used IONOS to host the website.

[Live Project](https://www.derekdhammaloka.co.uk/project1)

## Credits

### Media

Images taken from [pngegg.com](https://www.pngegg.com) except the star icon, which was created on Paint.

### Acknowledgements

- [Open Weather Map](https://openweathermap.org)
- [Open Cage Data](https://opencagedata.com)
- [Open Exchange](https://openexchangerates.org)
- [Geonames](https://www.geonames.org)
- [Open Street Map (OSM)](https://www.openstreetmap.org)
- [Open Street Map (OSM) - Copyright and License](https://www.openstreetmap.org/copyright)