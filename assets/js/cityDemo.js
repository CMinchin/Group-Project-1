// DOM manipulation selectors
cntDemoContainer = document.getElementById("demo-container");
lstDemoList = document.querySelector("#demo-list-holder");
txtCityName = document.getElementById("city-name");
txtInputParameters = document.getElementById("input-parameters");

// Global variables / assignments
const key = "5ae2e3f221c38a28845f05b6c796cf9acca90ae90403cc8866b3ca2f";

// parameters for city search
let cityName = "Paris"; //city selected
let radius = 5000;  // distance from centre searched in metres
let limit = 30; // max number of results to display
let rating = 3;  // popularity of attraction, higher is most popular
let filterString = "tourist_object,nature_reserves,malls"
// items from category list for which to search, comma separate no spaces
// category list is depicted at https://opentripmap.io/catalog

txtInputParameters.textContent = "City Name=" + cityName + ".  Radius searched=" + radius + " metres.  Number of results=" + limit + ".  Rating by popularity=" + rating + ". Filter String=" + filterString;

function getCityAttractions(lon, lat) {
  const apiUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=${filterString}&rate=${rating}&format=json&limit=${limit}&apikey=${key}`;

  return fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (dataAttract) {
      for (let i = 0; i < dataAttract.length; i++) {
        if (dataAttract[i].wikidata || 'true') {
          const liNameEl = document.createElement('li');
          liNameEl.textContent = dataAttract[i].name + " is " + (dataAttract[i].dist / 1000).toFixed(2) + " km from city centre at long/lat " + dataAttract[i].point.lon + "/" + dataAttract[i].point.lat + " with wikidata reference " + dataAttract[i].wikidata;
          lstDemoList.appendChild(liNameEl);
        }
      }
    })
}

const getCityCoordinates = function (city) {
  const apiUrl = `https://api.opentripmap.com/0.1/en/places/geoname?name=${city}&apikey=${key}`;

  return fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (dataCity) {
      let longitude = dataCity.lon;
      let latitude = dataCity.lat;
      // Print to page
      txtCityName.textContent = "Input Parameters for: " + dataCity.name + ", " + dataCity.country;
      const pPopEL = document.createElement('p');
      pPopEL.textContent = "City Population: " + dataCity.population;
      cntDemoContainer.appendChild(pPopEL);
      getCityAttractions(longitude, latitude);
    })
}

getCityCoordinates(cityName);
