import {
  googleDisplayGeoLocation,
  googleDisplayNearby,
  longdoDisplayNearby,
} from "./api.js";

const latLon = document.getElementById("latLon");
const posDetailUl = document.getElementById("posDetails");
const locListUl = document.getElementById("locList");
const refreshBtn = document.getElementById("refreshBtn");
const googleApiKeyInput = document.getElementById("google_api_key");
const longdoApiKeyInput = document.getElementById("longdo_api_key");
const apiTypeSelect = document.getElementById("api_type");
const orderSelect = document.getElementById("order_by");

let latLonData = "";

apiTypeSelect.addEventListener("change", async () => {
  if (apiTypeSelect.value === "google_nearby") {
    orderSelect.disabled = false;
  } else {
    orderSelect.disabled = true;
  }
});

refreshBtn.addEventListener("click", async () => {
  await search();
});

try {
  const apiKeyStorage = JSON.parse(localStorage.getItem("apiKey"));
  if (apiKeyStorage.google) {
    googleApiKeyInput.value = apiKeyStorage.google;
  }
  if (apiKeyStorage.longdo) {
    longdoApiKeyInput.value = apiKeyStorage.longdo;
  }
} catch {
  localStorage.setItem("apiKey", JSON.stringify({ google: "", longdo: "" }));
}

async function getCoords() {
  try {
    const p = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
      });
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

async function search() {
  localStorage.setItem(
    "apiKey",
    JSON.stringify({
      google: googleApiKeyInput.value,
      longdo: longdoApiKeyInput.value,
    })
  );
  console.log(localStorage.getItem("apiKey"));
  const locData = await displayDetails();
  if (apiTypeSelect.value === "longdo_nearby") {
    longdoDisplayNearby(longdoApiKeyInput.value, locData, locListUl);
  } else if (apiTypeSelect.value === "google_geocode") {
    googleDisplayGeoLocation(googleApiKeyInput.value, latLonData, locListUl);
  } else if (apiTypeSelect.value === "google_nearby") {
    googleDisplayNearby(
      googleApiKeyInput.value,
      locData,
      locListUl,
      orderSelect.value
    );
  }
}

await displayDetails();
