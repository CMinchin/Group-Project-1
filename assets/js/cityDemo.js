// DOM manipulation selectors
const cntDemoContainer = document.getElementById("demo-container");
const lstDemoList = document.querySelector("#demo-list-holder");
const txtCityName = document.getElementById("city-name");
const txtInputParameters = document.getElementById("input-parameters");
const cntCityInfo = document.getElementById("city-info");

// Global variables / assignments
const key = "5ae2e3f221c38a28845f05b6c796cf9acca90ae90403cc8866b3ca2f";

// replace with parameters from city and filter selection
let cityName = "Berlin"; //city selected
let radius = 5000;  // distance from centre searched in metres
let limit = 5; // max number of results to display
let rating = 3;  // popularity of attraction, higher is most popular
let filterString = "tourist_object"
// items from category list for which to search, comma separate no spaces
// category list is depicted at https://opentripmap.io/catalog

txtInputParameters.textContent = "City Name=" + cityName + ".  Radius searched=" + radius + " metres.  Number of results=" + limit + ".  Rating by popularity=" + rating + ". Filter String=" + filterString;

// Get City Information and Thumbnail image from Wikipedia
const getCityInfo = function (city) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&pilicense=any&prop=extracts|pageimages&explaintext=1&exsentences=3&redirects=0&titles=${city}&origin=*`;

  return fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (dataWiki) {
      if (dataWiki) {
        const pageID = Object.keys(dataWiki.query.pages);
       
        const cityExtract = dataWiki.query.pages[pageID[0]].extract;
        const cityPara = document.createElement('p');
        cityPara.textContent = cityExtract.replace('( (listen))', ' ');
        cityPara.textContent = cityExtract.replace('(listen))', ')');
        cntCityInfo.appendChild(cityPara);
        
        const cityImage = document.createElement('img');
        cityImage.src = dataWiki.query.pages[pageID[0]].thumbnail.source;
        cityImage.width = 200;
        cntCityInfo.appendChild(cityImage);
      }
    })
}

const getAttractions = function (city) {
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
      pPopEL.textContent = "City Population: " + dataCity.population.toLocaleString();
      cntCityInfo.appendChild(pPopEL);
      getCityAttractions(longitude, latitude);
    })
}

const getAttractionInfo = function(xid) {
  const apiUrlInfo = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${key}`

    return fetch(apiUrlInfo)
    .then(function (response) {
      return response.json();
    })
      .then(function (dataAttractInfo) {
        if (dataAttractInfo) {
          const iName = dataAttractInfo.name;
          const iImage = dataAttractInfo.preview.source;
          const iInfo = dataAttractInfo.wikipedia_extracts.text;
      
          return {
            _name: iName,
            _image: iImage,
            _info: iInfo,
          };
        }
    })
}

function getCityAttractions(lon, lat) {
  const apiUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=${filterString}&rate=${rating}&format=json&limit=${limit}&apikey=${key}`;

  const information = {};

  return fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (dataAttract) {
      for (let i = 0; i < dataAttract.length; i++) {
        if (dataAttract[i].wikidata) {
          const liNameEl = document.createElement('li');
          liNameEl.textContent = dataAttract[i].name + " is " + (dataAttract[i].dist / 1000).toFixed(2) + " km from city centre at long/lat " + dataAttract[i].point.lon + "/" + dataAttract[i].point.lat
          let xid = dataAttract[i].xid;
          getAttractionInfo(xid)
            .then(function (dataMore) {
              const newList = document.createElement('ol');
              const liTest = document.createElement('li');
              const image1 = document.createElement('img');
              const atInfo = document.createElement('li');
              liTest.textContent = dataMore._name;
              image1.src = dataMore._image;
              image1.width = 150;
              atInfo.textContent = dataMore._info;
              
              newList.appendChild(image1);
              newList.appendChild(atInfo);
              liNameEl.appendChild(newList);
            })
          lstDemoList.appendChild(liNameEl);
        }
      }
    })
}

getCityInfo(cityName);
getAttractions(cityName);