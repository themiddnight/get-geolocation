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
const googleKeyDiv = document.getElementById("google_key_div");
const longdoApiKeyInput = document.getElementById("longdo_api_key");
const longdoKeyDiv = document.getElementById("longdo_key_div");
const apiTypeSelect = document.getElementById("api_type");
const orderSelect = document.getElementById("order_by");
const radiusInput = document.getElementById("radius");

let locData = {};

// Event listeners
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

refreshBtn.addEventListener("click", () => {
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

// Get current position
navigator.geolocation.watchPosition(displayDetails, displayError, {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
});

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
    timestamp: p?.timestamp || "N/A",
  };
  latLon.innerHTML = `${locData.latitude},${locData.longitude}`;
  posDetailUl.innerHTML = "";
  Object.keys(locData).forEach((key, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${key}:</b> ${locData[key]}`;
    posDetailUl.appendChild(li);
  });
  refreshBtn.disabled = false;
}

function displayError(err) {
  console.error(err);
  latLon.innerHTML = "N/A";
  posDetailUl.innerHTML = "";
  refreshBtn.disabled = true;
}