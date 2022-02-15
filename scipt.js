const planetsApi = "https://findfalcone.herokuapp.com/planets";
const vehiclesApi = "https://findfalcone.herokuapp.com/vehicles";
const findFalconApi = "https://findfalcone.herokuapp.com/find";

let planets = [];
let vehicles = [];

// planets container
const planetsContainer = document.querySelector(".planets-container");
const planetSelctors = document.querySelectorAll(".planet-selector");

const fetchPlanets = async () => {
  const res = await fetch(planetsApi);
  const data = await res.json();
  return data;
};

const fetchVehicles = async () => {
  const res = await fetch(vehiclesApi);
  const data = await res.json();
  return data;
};

const populateSelect = (selector) => {
  vehicles.forEach((vh) => {
    const opt = document.createElement("option");
    opt.value = vh.name;
    opt.innerHTML = vh.name;
    selector.appendChild(opt);
  });
};

const main = async () => {
  planets = await fetchPlanets();
  vehicles = await fetchVehicles();

  planetSelctors.forEach((ps) => populateSelect(ps));
  console.log({ planets, vehicles });
};

main();
