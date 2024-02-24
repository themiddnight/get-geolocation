import {
  googleDisplayGeoLocation,
  googleDisplayNearby,
  longdoDisplayNearby,
} from "./api.js";

const latLon = document.getElementById("latLon");
const posDetailUl = document.getElementById("posDetails");
const locListUl = document.getElementById("locList");
const highAccuCheck = document.getElementById("highAccuracy");
const pauseBtn = document.getElementById("pauseBtn");
const searchBtn = document.getElementById("searchBtn");
const googleApiKeyInput = document.getElementById("google_api_key");
const googleKeyDiv = document.getElementById("google_key_div");
const longdoApiKeyInput = document.getElementById("longdo_api_key");
const longdoKeyDiv = document.getElementById("longdo_key_div");
const apiTypeSelect = document.getElementById("api_type");
const orderSelect = document.getElementById("order_by");
const radiusInput = document.getElementById("radius");

const geoLoc = navigator.geolocation;

let count = 0;
let isHighAccuracy = true;
let isPaused = false;
let locData = {};
let watchID;

// Get current position
watchID = geoLoc.watchPosition(displayDetails, displayError, {
  enableHighAccuracy: isHighAccuracy,
  timeout: 5000,
  maximumAge: 0,
});

// Event listeners
highAccuCheck.addEventListener("change", () => {
  isHighAccuracy = !isHighAccuracy;
  highAccuCheck.checked = isHighAccuracy;
  count = 0;
  geoLoc.clearWatch(watchID);
  watchID = geoLoc.watchPosition(displayDetails, displayError, {
    enableHighAccuracy: isHighAccuracy,
    timeout: 5000,
    maximumAge: 0,
  });
});

pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseBtn.innerHTML = isPaused ? "Resume" : "Pause";
  searchBtn.disabled = isPaused;
  if (isPaused) {
    geoLoc.clearWatch(watchID);
  } else {
    watchID = geoLoc.watchPosition(displayDetails, displayError, {
      enableHighAccuracy: isHighAccuracy,
      timeout: 5000,
      maximumAge: 0,
    });
  }
});

apiTypeSelect.addEventListener("change", () => {
  if (apiTypeSelect.value === "google_nearby") {
    orderSelect.disabled = false;
    googleKeyDiv.classList.remove("hidden");
    longdoKeyDiv.classList.add("hidden");
  } else if (apiTypeSelect.value === "google_geocode") {
    orderSelect.disabled = true;
    googleKeyDiv.classList.remove("hidden");
    longdoKeyDiv.classList.add("hidden");
  } else if (apiTypeSelect.value === "longdo_nearby") {
    orderSelect.disabled = true;
    googleKeyDiv.classList.add("hidden");
    longdoKeyDiv.classList.remove("hidden");
  }
});

searchBtn.addEventListener("click", () => {
  localStorage.setItem(
    "apiKey",
    JSON.stringify({
      google: googleApiKeyInput.value,
      longdo: longdoApiKeyInput.value,
    })
  );
  locListUl.innerHTML = "...";
  if (apiTypeSelect.value === "longdo_nearby") {
    longdoDisplayNearby(
      longdoApiKeyInput.value, 
      locData.latitude,
      locData.longitude,
      radiusInput.value,
      locListUl
    );
  } else if (apiTypeSelect.value === "google_geocode") {
    googleDisplayGeoLocation(
      googleApiKeyInput.value,
      `${locData.latitude},${locData.longitude}`, 
      locListUl
    );
  } else if (apiTypeSelect.value === "google_nearby") {
    googleDisplayNearby(
      googleApiKeyInput.value,
      locData.latitude,
      locData.longitude,
      orderSelect.value,
      radiusInput.value,
      locListUl,
    );
  }
});

// Start app
// Load API keys from local storage
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

function displayDetails(p) {
  latLon.innerHTML = "...";
  locData = {
    latitude: p?.coords.latitude || "N/A",
    longitude: p?.coords.longitude || "N/A",
    accuracy: p?.coords.accuracy || "N/A",
    altitude: p?.coords.altitude || "N/A",
    altitudeAccuracy: p?.coords.altitudeAccuracy || "N/A",
    heading: p?.coords.heading || "N/A",
    speed: p?.coords.speed || "N/A",
    refreshCount: count++,
  };
  latLon.innerHTML = `${locData.latitude},${locData.longitude}`;
  posDetailUl.innerHTML = "";
  Object.keys(locData).forEach((key, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${key}:</b> ${locData[key]}`;
    posDetailUl.appendChild(li);
  });
  searchBtn.disabled = false;
}

function displayError(err) {
  console.error(err);
  latLon.innerHTML = "N/A";
  posDetailUl.innerHTML = "";
  searchBtn.disabled = true;
}