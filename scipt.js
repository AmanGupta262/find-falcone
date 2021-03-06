const baseUrl = "https://findfalcone.herokuapp.com";
const planetsApi = `${baseUrl}/planets`;
const vehiclesApi = `${baseUrl}/vehicles`;
const findFalconApi = `${baseUrl}/find`;
const getToken = `${baseUrl}/token`;

let planets = [];
let vehicles = [];

// planets container
const planetsContainer = document.querySelector(".planets-container");
const planetSelctors = document.querySelectorAll(".planet-selector");
const timeContainer = document.querySelector(".time-taken");
const findFalconeContainer = document.querySelector(".find-falcone-container");
const configContainer = document.querySelector(".configuration");
const resultContainer = document.querySelector(".result");
const successResponse =
  "Success! Congratulations on Finding Falcone, King Shah is mighty pleased.";

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

const calculateTime = () => {
  const selectedPlanets = planets.filter((pl) => pl.selected && pl.speed);
  let totalTime = 0;
  selectedPlanets.forEach((sp) => {
    if (sp.selected && sp.speed) {
      const time = sp.distance / parseInt(sp.speed);
      console.log({ time, d: sp.distance, s: sp.speed });
      totalTime += time;
    }
  });
  timeContainer.innerHTML = totalTime;

  if (selectedPlanets.length === 4) findFalconeContainer.classList.add("show");
  else findFalconeContainer.classList.remove("show");

  return totalTime;
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
      }' name="${planet}-vehicles" id="${planet}-vehicle${index + 1}" />
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

  calculateTime();
};

const handleVehicleSelect = (e) => {
  const name = e.value;
  const planet = e.getAttribute("data-planet");

  const selectedPlanet = planets.find((pl) => pl.selectNode === planet);
  const vehicle = vehicles.find((vh) => vh.name === name);
  const previousVehicleName = selectedPlanet.vehicle;
  const previousVehicle = vehicles.find(
    (vh) => vh.name === previousVehicleName
  );

  if (previousVehicle) {
    previousVehicle.total_no += 1;
    previousVehicle.selectNode = "";
  }

  vehicle.total_no -= 1;
  vehicle.selectNode = planet;
  vehicle.selected = true;
  selectedPlanet.vehicle = vehicle.name;
  selectedPlanet.speed = vehicle.speed;

  populateVehicles();
  calculateTime();
};

const reset = async () => {
  configContainer.classList.remove("hide");
  resultContainer.classList.remove("show");
  findFalconeContainer.classList.remove("show");

  planets = await fetchPlanets();
  planets = planets.map((pl) => ({
    ...pl,
    selected: false,
    selectNode: "",
    vehicle: "",
    speed: 0,
  }));

  vehicles = await fetchVehicles();
  vehicles = vehicles.map((pl) => ({
    ...pl,
    selected: false,
  }));

  populateSelect();
  populateVehicles();

  timeContainer.innerHTML = 0;
};

const findFalcone = async () => {
  let res = await fetch(getToken, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  let resJson = await res.json();
  const { token } = resJson;

  const selectedPlanets = planets.filter((pl) => pl.selected && pl.speed);

  res = await fetch(findFalconApi, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      planet_names: selectedPlanets.map((sp) => sp.name),
      vehicle_names: selectedPlanets.map((sp) => sp.vehicle),
    }),
  });

  resJson = await res.json();

  configContainer.classList.add("hide");
  resultContainer.classList.add("show");

  if (resJson.error)
    resultContainer.innerHTML = `<div>${error}</div><div><button onclick="reset()">Start Again</button>`;
  else if (resJson.status === "false")
    resultContainer.innerHTML = `<div>Sorry, Falcone is not present in any of them</div><div><button onclick="reset()">Start Again</button>`;
  else
    resultContainer.innerHTML = `<div>${successResponse}</div><div>Time taken: ${calculateTime()}</div><div>Planet: ${
      resJson.planet_name
    }</div><div><button onclick="reset()">Start Again</button></div>`;
};

const main = async () => {
  await reset();
};

main();
