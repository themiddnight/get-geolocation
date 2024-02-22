import { displayGeoLocation, displayNearby } from "./api.js";

const latLon = document.getElementById("latLon");
const posDetailUl = document.getElementById("posDetails");
const locListUl = document.getElementById("locList");
const refreshBtn = document.getElementById("refreshBtn");
const apiKeyInput = document.getElementById("api_key");
const apiTypeSelect = document.getElementById("api_type");
const orderSelect = document.getElementById("order_by");

apiTypeSelect.addEventListener("change", async () => {
  if (apiTypeSelect.value === "geocode") {
    orderSelect.disabled = true;
  } else {
    orderSelect.disabled = false;
  }
});

refreshBtn.addEventListener("click", async () => {
  await refresh();
});

const apiKeyStorage = localStorage.getItem("apiKey");
if (apiKeyStorage) {
  apiKeyInput.value = apiKeyStorage;
}

let latLonData = "";

async function getCoords() {
  try {
    const p = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return {
      accuracy: p.coords.accuracy,
      altitude: p.coords.altitude,
      altitudeAccuracy: p.coords.altitudeAccuracy,
      heading: p.coords.heading,
      latitude: p.coords.latitude,
      longitude: p.coords.longitude,
      speed: p.coords.speed,
    };
  } catch (error) {
    console.error("Error getting geolocation:", error);
    return {
      error: error.message,
    };
  }
}

async function displayDetails() {
  const locData = await getCoords();
  latLon.innerHTML = "...";
  locListUl.innerHTML = "...";
  latLonData = `${locData.latitude},${locData.longitude}`;
  latLon.innerHTML = latLonData;
  posDetailUl.innerHTML = "";
  Object.keys(locData).forEach((key, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${key}:</b> ${locData[key]}`;
    posDetailUl.appendChild(li);
  });
  return locData;
}

async function refresh() {
  if (apiKeyInput.value) {
    localStorage.setItem("apiKey", apiKeyInput.value);
  }
  const locData = await displayDetails();
  if (apiTypeSelect.value === "geocode") {
    displayGeoLocation(apiKeyInput.value, latLonData, locListUl);
  } else {
    displayNearby(apiKeyInput.value, locData, locListUl, orderSelect.value);
  }
}

await displayDetails();
