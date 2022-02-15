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

const populateSelect = () => {
  planetSelctors.forEach((selector) => {
    selector.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.innerHTML = "Select planet";
    selector.appendChild(defaultOpt);

    planets.forEach((pl) => {
      const opt = document.createElement("option");
      const selectName = selector.getAttribute("name");

      opt.value = pl.name;
      opt.innerHTML = pl.name;

      if (pl.selected) {
        if (pl.selectNode === selectName) opt.selected = true;
        else opt.disabled = true;
      }

      selector.appendChild(opt);
    });
  });
};

const handleSelect = (e) => {
  const selectedOption = e.value;
  const selectName = e.getAttribute("name");

  const previousSelected = planets.find((pl) => pl.selectNode === selectName);

  if (previousSelected) {
    previousSelected.selected = false;
    previousSelected.selectNode = "";
  }

  const selectedPlanet = planets.find((pl) => pl.name === selectedOption);
  selectedPlanet.selectNode = selectName;
  selectedPlanet.selected = true;

  populateSelect();
  console.log({ planets });
};

const main = async () => {
  planets = await fetchPlanets();
  planets = planets.map((pl) => ({ ...pl, selected: false, selectNode: "" }));
  vehicles = await fetchVehicles();
  vehicles = vehicles.map((pl) => ({ ...pl, selected: false }));

  populateSelect();
  console.log({ planets, vehicles });
};

main();
