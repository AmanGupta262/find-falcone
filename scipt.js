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

const disableVehicle = (count, distance, max_distance) => {
  if (count < 1 || max_distance < distance) return true;
  return false;
};

const populateVehicles = () => {
  for (let i = 1; i <= 4; i++) {
    const planet = `planet${i}`;
    const vehicleContainer = document.querySelector(
      `.vehicles-container.planet${i}`
    );

    vehicleContainer.innerHTML = "";

    vehicles.forEach((veh, index) => {
      const newVehicle = document.createElement("div");
      newVehicle.classList.add("vehicle");

      let distance = 0;
      const selectedPlanet = planets.find((pl) => pl.selectNode === planet);
      if (selectedPlanet) distance = selectedPlanet.distance;

      const checked =
        veh.selected && selectedPlanet && selectedPlanet.vehicle === veh.name;
      const disabled =
        disableVehicle(veh.total_no, distance, veh.max_distance) && !checked;

      newVehicle.innerHTML = `
      <input type="radio" ${disabled ? "disabled" : ""} ${
        checked ? "checked" : ""
      } value="${
        veh.name
      }" data-planet="${planet}" onchange='handleVehicleSelect(this)' data-count='${
        veh.total_no
      }' data-speed="${veh.speed}" data-distance="${
        veh.max_distance
      }" name="${planet}-vehicles" id="${planet}-vehicle${index + 1}" />
      <label for="${planet}-vehicle${index + 1}">${veh.name} (${
        veh.total_no
      })</label>`;

      vehicleContainer.appendChild(newVehicle);
    });
  }
};

const populateSelect = () => {
  planetSelctors.forEach((selector) => {
    selector.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.innerHTML = "Select planet";
    selector.appendChild(defaultOpt);

    const selectName = selector.getAttribute("name");

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
    const vehicle = vehicles.find((vh) => previousSelected.vehicle === vh.name);
    if (vehicle) {
      vehicle.total_no += 1;
      vehicle.selected = false;
    }
    previousSelected.vehicle = "";
  }

  if (selectedOption) {
    const selectedPlanet = planets.find((pl) => pl.name === selectedOption);
    selectedPlanet.selectNode = selectName;
    selectedPlanet.selected = true;
  }

  populateSelect();
  populateVehicles();

  const vehicleContainer = document.querySelector(
    `.vehicles-container.${selectName}`
  );
  if (selectedOption) vehicleContainer.classList.add("show");
  else vehicleContainer.classList.remove("show");
};

const handleVehicleSelect = (e) => {
  const count = e.getAttribute("data-count");
  const name = e.value;
  const planet = e.getAttribute("data-planet");

  const selectedPlanet = planets.find((pl) => pl.selectNode === planet);
  const vehicle = vehicles.find((vh) => vh.name === name);
  const previousVehicleName = selectedPlanet.vehicle;
  const previousVehicle = vehicles.find(
    (vh) => vh.name === previousVehicleName
  );
  console.log({ previousVehicle, previousVehicleName });

  if (previousVehicle) {
    previousVehicle.total_no += 1;
    previousVehicle.selectNode = "";
  }

  vehicle.total_no -= 1;
  vehicle.selectNode = planet;
  vehicle.selected = true;
  selectedPlanet.vehicle = vehicle.name;

  populateVehicles();

  console.log({ count, name, planet });
};

const main = async () => {
  planets = await fetchPlanets();
  planets = planets.map((pl) => ({
    ...pl,
    selected: false,
    selectNode: "",
    vehicle: "",
  }));
  vehicles = await fetchVehicles();
  vehicles = vehicles.map((pl) => ({
    ...pl,
    selected: false,
  }));

  populateSelect();
  populateVehicles();
  console.log({ planets, vehicles });
};

main();
