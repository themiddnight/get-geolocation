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
      if (data.results.length > 0) {
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
      } else {
        ulElement.innerHTML = "No results";
      }
    })
    .catch((error) => {
      console.error("Error getting geolocation:", error);
      ulElement.innerHTML = `Error getting geolocation: ${error}`;
    });
}

export function googleDisplayNearby(key, lat, lon, order, radius, ulElement) {
  fetch("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": `
        places.displayName.text,
        places.id,places.googleMapsUri,
        places.primaryType,
      `.replace(/\s/g, ""),
    },
    body: JSON.stringify({
      maxResultCount: 20,
      rankPreference: order,
      locationRestriction: {
        circle: {
          center: {
            latitude: lat,
            longitude: lon,
          },
          radius
        },
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      ulElement.innerHTML = "";
      if (data.places) {
        data.places.forEach((result) => {
          const li = document.createElement("li");
          li.classList.add("loc-item");
          li.innerHTML = `
              <b><a href=${result.googleMapsUri} target="_blank">${result.displayName.text}</a></b><br>
              <small><b>primaryType:</b> ${result.primaryType}</small><br>
              <small><b>id:</b> ${result.id}</small>
            `;
          ulElement.appendChild(li);
        });
      } else {
        ulElement.innerHTML = "No results";
      }
    })
    .catch((error) => {
      console.error("Error getting nearby places:", error);
      ulElement.innerHTML = `Error getting nearby places: ${error}`;
    });
}

export function longdoDisplayNearby(key, lat, lon, radius, ulElement) {
  fetch(
    `https://api.longdo.com/POIService/json/search
      ?lat=${lat}
      &lon=${lon}
      &span=${radius}m
      &limit=100
      &key=${key}`.replace(/\s/g, "")
  )
    .then((response) => response.json())
    .then((data) => {
      ulElement.innerHTML = "";
      if (data.data.length > 0) {
        data.data.forEach((result) => {
          const li = document.createElement("li");
          li.classList.add("loc-item");
          li.innerHTML = `
                <b><a href=https://map.longdo.com/main/p/${result.id} target="_blank">${result.name}</a></b><br>
                <small><b>distance:</b> ${result.distance}</small><br>
                <small><b>type:</b> ${result.type}</small><br>
                <small><b>id:</b> ${result.id}</small>
              `;
          ulElement.appendChild(li);
        });
      } else {
        ulElement.innerHTML = "No results";
      }
    })
    .catch((error) => {
      console.error("Error getting nearby places:", error);
      ulElement.innerHTML = `Error getting nearby places: ${error}`;
    });
}
