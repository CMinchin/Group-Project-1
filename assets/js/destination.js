// DOM manipulation selectors
const cntDemoContainer = document.querySelector(".inner-wrapper");
const lstDemoList = document.querySelector("#list-holder");
const txtCityName = document.getElementById("city-name");
const txtInputParameters = document.getElementById("input-parameters");
const cntCityInfo = document.getElementById("city-info");
const webTitle = document.querySelector("title")
const popInfo = document.querySelector(".pop-info")
const colImg = document.querySelector(".col-img")
const colInfo = document.querySelector(".col-info")
const infoBox = document.querySelector(".info-box")

const conditionsFields = document.querySelector(".conditions")
const tempFields = document.querySelector(".temp")
const windFields = document.querySelector(".wind")
const humidityFields = document.querySelector(".humidity")
const uvFields = document.querySelector(".uv")
const uvIndicator = document.querySelector("span")

const backBtn = document.querySelector(".back-btn")
const refreshBtn = document.querySelector(".refresh-btn")

const small = document.querySelector(".small") 
const mid = document.querySelector(".mid") 
const large = document.querySelector(".large") 

const popupContainer = document.querySelector(".popup-container")

// Global variables / assignments
const key = "5ae2e3f221c38a28845f05b6c796cf9acca90ae90403cc8866b3ca2f";


const endLoader = setTimeout(function(){
  popupContainer.style = "display:none"
}, 4000)

// URL Parameters

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


const url = window.location.search

console.log(url)
let params = url.split(/[&=]+/)
console.log(params)




// replace with parameters from city and filter selection
let cityName = capitalizeFirstLetter(params[1]); //city selected
let radius = 50000;  // distance from centre searched in metres
let limit = params[7]*3; // max number of results to display
let rating = 20;  // popularity of attraction, higher is most popular
let filterString = params[3]
// items from category list for which to search, comma separate no spaces
// category list is depicted at https://opentripmap.io/catalog


webTitle.textContent = cityName

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
        const wikiButton = document.createElement("a")
        wikiButton.className = "wiki-btn";
        wikiButton.href = "https://en.wikipedia.org/?curid=" + dataWiki.query.pages[pageID[0]].pageid
        wikiButton.innerHTML = '<button class="wiki-btn">Learn More</button>'
        cityPara.textContent = cityExtract.replace('( (listen))', ' ');
        cityPara.textContent = cityExtract.replace('(listen))', ')');
        infoBox.appendChild(cityPara);
        infoBox.appendChild(wikiButton)
      }
    })
}

function checkPop(population){
  if (population < 100000) {
    small.style = "background: var(--main)"
  } else if (population > 100000 && population < 2000000) {
    small.style = "background: var(--main)"
    mid.style = "background: var(--main)"
  } else {
    small.style = "background: var(--main)"
    mid.style = "background: var(--main)"
    large.style = "background: var(--main)"
  }
}

fetch(`https://api.pexels.com/v1/search?query=${cityName}`,{
  headers: {
    Authorization: "563492ad6f91700001000001fa27db3695e04de88c24527f7876e50e"
  }
})
   .then(resp => {
     return resp.json()
   })
   .then(data => {
     console.log(data.photos[0].src.original);
     const cityImage = document.createElement("img")
     const imgBox = document.createElement("div")
     cityImage.src = data.photos[0].src.original
     cityImage.className = "city-image"
     imgBox.className = "img-box"
     imgBox.appendChild(cityImage)
     colImg.appendChild(imgBox)
   })

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
      txtCityName.textContent = dataCity.name + ", " + dataCity.country;
      const pPopEL = document.createElement('p');
      pPopEL.textContent = "City Population: " + dataCity.population.toLocaleString();
      popInfo.appendChild(pPopEL);

      checkPop(dataCity.population)
      getCityAttractions(longitude, latitude);
      fillWeather(latitude, longitude)
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
            const liNameEl = document.createElement('div');
            liNameEl.className = "card-content"
            const mainText = document.createElement('p');
            mainText.style = "font-weight: bold; "
            const seconText = document.createElement('p');
            mainText.textContent = dataAttract[i].name  
            seconText.textContent = (dataAttract[i].dist / 1000).toFixed(2) + " km from city centre!"
            liNameEl.appendChild(mainText)
            liNameEl.appendChild(seconText)

            let xid = dataAttract[i].xid;
            getAttractionInfo(xid)
            .then(function (dataMore) {
                const image1 = document.createElement('img');
                const atInfo = document.createElement('p');
                atInfo.className = "info-text"
                image1.src = dataMore._image;
                image1.width = 150;
                atInfo.textContent = dataMore._info;
                
                liNameEl.appendChild(image1);
                liNameEl.appendChild(atInfo);

            })
            const cardWrapper = document.createElement("div")
            cardWrapper.className = "card-wrapper"
          cardWrapper.appendChild(liNameEl);
          lstDemoList.appendChild(cardWrapper); 
        }
      }
    })
}

function checkUV(UV) {
  if (0 <= UV && UV <3) {
      return "#27AE60"
  } else if (3 <= UV && UV < 7) {
      return "#F1C40F"
  } else {
      return "#E74C3C"
  }
}

function fillWeather(lat, lon) {
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=d322ae663fb727b202d40d6c138ddd30")
      .then(function (response) {
          if (response.ok) {
              response.json().then(function (data) {
                      tempFields.textContent = `Temp: ${data.daily[0].temp.day} °C`
                      windFields.textContent = `Wind: ${data.daily[0].wind_speed} MPH`
                      humidityFields.textContent = `Humidity: ${data.daily[0].humidity} %`
                      uvIndicator.textContent = data.daily[0].uvi
                      uvIndicator.style.background = checkUV(data.daily[0].uvi)
              });
          } else {
              return;
          }
      })
}

getCityInfo(cityName);
getAttractions(cityName);

backBtn.addEventListener("click", function(){
  window.location.href = "index.html"
})

refreshBtn.addEventListener("click", function(){
  window.location.reload()
})

