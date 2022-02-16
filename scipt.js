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

const populateVehicles = (planet) => {
  const vehicleContainer = document.querySelector(
    `.vehicles-container.${planet}`
  );

  vehicleContainer.innerHTML = "";

  vehicles.forEach((veh, index) => {
    const newVehicle = document.createElement("div");
    newVehicle.classList.add("vehicle");

    let distance = 0;
    const selectedPlanet = planets.find((pl) => pl.selectNode === planet);
    if (selectedPlanet) distance = selectedPlanet.distance;

    newVehicle.innerHTML = `
      <input type="radio" ${
        veh.max_distance < distance ? "disabled" : ""
      } value="${veh.name}" onchange='handleVehicleSelect(this)' data-count='${
      veh.total_no
    }' data-speed="${veh.speed}" data-distance="${
      veh.max_distance
    }" name="${planet}-vehicles" id="${planet}-vehicle${index + 1}" />
      <label for="${planet}-vehicle${index + 1}">${veh.name} (${
      veh.total_no
    })</label>`;

    vehicleContainer.appendChild(newVehicle);
  });
};

const populateSelect = () => {
  planetSelctors.forEach((selector) => {
    selector.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.innerHTML = "Select planet";
    selector.appendChild(defaultOpt);

    const selectName = selector.getAttribute("name");
    populateVehicles(selectName);
    planets.forEach((pl) => {
      const opt = document.createElement("option");

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

  if (selectedOption) {
    const selectedPlanet = planets.find((pl) => pl.name === selectedOption);
    selectedPlanet.selectNode = selectName;
    selectedPlanet.selected = true;
  }

  populateSelect();

  const vehicleContainer = document.querySelector(
    `.vehicles-container.${selectName}`
  );
  if (selectedOption) vehicleContainer.classList.add("show");
  else vehicleContainer.classList.remove("show");
};

const handleVehicleSelect = (e) => {
  console.log("called", e.value);
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
