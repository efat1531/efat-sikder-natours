/* eslint-disable */

// Path: public/js/mapbox.js
const locations = JSON.parse(document.getElementById("map").dataset.locations);

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3AzY3RlciIsImEiOiJjbHYzdTU0c2cwMWwwMm5vdXkzNXdlb3EyIn0.Dd_N2mZxP4uUujCvTBfCKw";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/sp3cter/clv40s3ea00f501q1581lf80x",
  scrollZoom: false,
});

const bound = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement("div");
  el.className = "marker";

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: "bottom",
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bound.extend(loc.coordinates);
});

map.fitBounds(bound, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
