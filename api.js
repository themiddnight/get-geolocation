export function googleDisplayGeoLocation(key, latLonData, ulElement) {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json
      ?latlng=${latLonData}
      &language=th
      &key=${key}`.replace(/\s/g, "")
  )
    .then((response) => response.json())
    .then((data) => {
      ulElement.innerHTML = "";
      data.results.forEach((result) => {
        const li = document.createElement("li");
        li.classList.add("loc-item");
        li.innerHTML = `
              <b>${result.formatted_address}</b><br>
              <small><b>result_type:</b> ${result.types}</small><br>
              <small><b>location_type:</b> ${result.geometry.location_type}</small><br>
              <small style="word-break: break-all"><b>place_id:</b> ${result.place_id}</small>
            `;
        ulElement.appendChild(li);
      });
    });
}

export function googleDisplayNearby(key, latLonData, ulElement, order) {
  try {
    fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.displayName.text,places.id,places.googleMapsUri",
      },
      body: JSON.stringify({
        maxResultCount: 10,
        rankPreference: order,
        locationRestriction: {
          circle: {
            center: {
              latitude: latLonData.latitude,
              longitude: latLonData.longitude,
            },
            radius: 100.0,
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        ulElement.innerHTML = "";
        data.places.forEach((result) => {
          const li = document.createElement("li");
          li.classList.add("loc-item");
          li.innerHTML = `
              <b><a href=${result.googleMapsUri}>${result.displayName.text}</a></b><br>
              <small><b>place_id:</b> ${result.id}</small>
            `;
          ulElement.appendChild(li);
        });
      })
      .catch((error) => {
        console.error("Error getting nearby places:", error);
      });
  } catch (error) {
    console.error("Error getting nearby places:", error);
  }
}

export function longdoDisplayNearby(key, latLonData, ulElement) {
  fetch(
    `https://api.longdo.com/POIService/json/search
      ?lat=${latLonData.latitude}
      &lon=${latLonData.longitude}
      &span=100m
      &limit=10
      &key=${key}`.replace(/\s/g, "")
  )
    .then((response) => response.json())
    .then((data) => {
      ulElement.innerHTML = "";
      data.data.forEach((result) => {
        const li = document.createElement("li");
        li.classList.add("loc-item");
        li.innerHTML = `
              <b>${result.name}</b><br>
              <small><b>distance:</b> ${result.distance}</small><br>
              <small><b>type:</b> ${result.type}</small><br>
              <small><b>id:</b> ${result.id}</small>
            `;
        ulElement.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error getting nearby places:", error);
    });
}