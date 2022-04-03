

// Declarations

var geocoder;
var map;

const acceptBtn = document.querySelector(".accept-btn")
const denyBtn = document.querySelector(".deny-btn")
const popupContainer = document.querySelector(".popup-container")

const randomBtn = document.querySelector(".random-btn")

const searchField = document.querySelector(".search-field")
const submitBtn = document.querySelector(".submit-btn")
const popupText = document.querySelector(".popup p")

const citiesList = [
  "Paris","New York","Sydney","Barcelona","London","Rome","San Francisco","Bangkok", "Cape Town", "Istanbul", "Melbourne" ,"Hong Kong","Kathmandu","Prague","Vancouver","Buenos Aires","Rio De Janeiro","Berlin","Jerusalem","Montreal","Edinburgh","Venice","Hanoi","Amsterdam","Singapore","Tokyo","Florence","Dublin","Mexico City","Krakow","Toronto","Cairo","Budapest","Chicago","Havana","Madrid","Munich","Athens","New Orleans","Vienna","Ho Chi Minh City","Marrakesh","Sarajevo","Seville","Kyoto","Las Vegas","Perth","Shanghai","Los Angeles","Lisbon","Stockholm","Kuala Lumpur","Damascus","Luang Prabang","Seattle","Phnom Penh","S Petersburg","Cuzco","Delhi","Dubrovnik","Moscow","Salvador Da Bahia","Beijing","Helsinki","Kolkata","Santiago","Fes","Auckland","Manila","Puerto Vallarta","Chiang Mai","Varanasi","Cartagena","Zanzibar","Innsbruck","York","Mumbai","Hamburg","Oaxaca","Galway","Siena","Ifahan","Wellington","Ljubljana","Seoul","San Cristobal","Taipei","Tallinn","Lhasa","Bled","Hobart","Jaipur","Brussels","La Paz","Quebec City","Valparaiso","Naples","Memphis","Heidelberg","Dhaka","Amman","Monaco","Washington","Quito","Christchurch","Glasgow","Muscat","Panama City","Dakar","Bratislava","San Sebastian","Bern","San Juan","Aleppo","Dubai","Riga","Asmara","Kabul","Bath","Copenhagen","Macau","Sofia","Hoi An","Marseille","Zagreb","Manchester","Antigua","Reykjavik","Yogyakarta","Carcassone","Lubeck","Tel Aviv","Hiroshima","Mendoza","Nairobi","Beirut","Vilnius","Montevideo","Yangon","Arequipa","Bucharest","Apia","Belgrade","Dar Es Salaam","Kiev","Bukhara","Male","Caracas","Tirana","Suva","Tbilisi","Agadez","Ushuaia","Kampala","Bogota","Bridgetown","Ulaanbaatar","Abuja","Laval","Sanaa","Livingstone","Alexandria","Belfast","Savannah","Nuuk","Jeddah","Johannesburg","Kairouan","Austin","San Salvador","Cardiff","Minsk","Thimphu","Khartoum","Anchorage","Mecca","Aswan","Yerevan","Luxembourg","Georgetown","Maputo","Baku","Belize City","Essaouira","Santo Domingo","Addis Ababa, Ethiopia","Pyongyang","Lahore","Cayenne","Almaty","Mombasa","Valletta","Antananarivo","Miami","Bamako","Saint-Denis","Granada","Beira","Madang","Ashgabat"
]


function popupConfirm(location) {
  popupContainer.style.display = "flex";
  popupText.textContent = "Select " + location + "?"
  
  denyBtn.addEventListener("click", function(){
    popupContainer.style.display = "none";
  })

  acceptBtn.addEventListener("click", function(){
    popupContainer.style.display = "none";
    searchField.value = location
  })
}

function initMap() {
  const paris = { lat: 48.864, lng: 2.349 }; 

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 3,
    center: paris,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    scrollwheel: false,
  });
    

  geocoder = new google.maps.Geocoder()
  
  function createMarker(location, cityName) {
    let marker = new google.maps.Marker({
      position: location,
      map: map,
      title: cityName,
    })
    google.maps.event.addListener(marker, 'click', function() { 
      popupConfirm(marker.title)
    }); 

    return marker;
  }

  // Limiting to 10 markers due to query request limitations
  for (let i = 0; i < 10; i++) {
    geocoder.geocode({"address" : citiesList[i]}, function(results, status){
      if (status == 'OK') {
        createMarker(results[0].geometry.location, citiesList[i])
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }    
    })
  }

  // Autocomplete
  let options = {
    types: ['(cities)']
  }
  new google.maps.places.Autocomplete(searchField, options)

  // Random Generation

  function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  }

  function getCoords(){
    let latlng = {
    lat: getRandomInRange(-90, 90, 3),
    lng: getRandomInRange(-180, 180, 3),
    }
    return latlng
  }
  
  function findLocation() {
    // Given an Interval in order to not have too many query requests.
    const locationInterval = setInterval(() => {
      geocoder.geocode({location: getCoords()}).then((response) => {
        if (response.results[0]) {
          let locality = response.results[0].address_components.filter(function(el){
            return el.types[0] === "locality"
          }) 
          if (locality.length == 1) {
              searchField.value = locality[0].short_name
              clearInterval(locationInterval)
          } 
          else {
            searchField.value = ""
            searchField.placeholder = "Searching..."
          }
        }
      })
      
    }, 1500 );
  }
  
  randomBtn.addEventListener("click", function(event){
    event.preventDefault();
    findLocation()
  })
}

submitBtn.addEventListener("click", function(event){
  event.preventDefault()
  let submitCity = "perth"
  let submitFilters = "cultural+amusements"
  let submitAcc = true
  let submitTime = 15



  window.location.href = "destination.html?q=" + submitCity + "&filter=" + submitFilters + "&acc=" + submitAcc + "&time=" + submitTime
})
  