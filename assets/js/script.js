const btnSubmitEl = document.getElementById("submit");
const btnRandomEl = document.getElementById("random");


const getFilters = function (event) {
  event.preventDefault();
  console.log("in getFilters");
  // Dependent on how filters are presented

}


const randomiser = function (event) {
  event.preventDefault();
  console.log("in randomiser");
  // randomise code goes in here
}

console.log("this is linked");

btnSubmitEl.addEventListener('click', getFilters);

btnRandomEl.addEventListener('click', randomiser);