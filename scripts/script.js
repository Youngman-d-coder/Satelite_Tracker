const satelliteIcon = L.icon({
  iconUrl: "../assets/satellite_icon.png", // Path to the icon in the assets folder
  iconSize: [40, 40], // Size of the icon
  iconAnchor: [16, 16], // Anchor point of the icon (centered)
  popupAnchor: [0, -16], // Popup position
});

// Initialize the map
const map = L.map("map").setView([0, 0], 2); // Set the initial view to [0, 0] (Equator) with a world-level zoom of 2

// Create the ISS marker with the satellite icon
const issMarker = L.marker([0, 0], { icon: satelliteIcon }).addTo(map);

// Add a tile layer (OpenStreetMap tiles)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18, // Maximum zoom level
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Function to format the timestamp
function formatTimestamp(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const loadingSpinner = document.getElementById("loading-spinner");

// Function to update the ISS marker's position
async function updateISSLocation() {
  loadingSpinner.style.display = "block";
  try {
    const response = await axios.get("http://api.open-notify.org/iss-now.json");
    const { latitude, longitude } = response.data.iss_position;

    // Update marker location and center the map
    issMarker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude], 2); // Adjust zoom as needed

    // Update latitude and longitude display
    document.getElementById("latitude").textContent = latitude;
    document.getElementById("longitude").textContent = longitude;

    // Update timestamp
    const timestamp = formatTimestamp(new Date());
    document.getElementById("timestamp").textContent = timestamp;
  } catch (error) {
    console.error("Error fetching ISS location:", error);
  } finally {
    loadingSpinner.style.display = "none";
  }
}

// Select the refresh button
const refreshButton = document.getElementById("refreshButton");

// Add click event listener to refresh button
refreshButton.addEventListener("click", () => {
  updateISSLocation(); // Call the function to update the ISS location
});

// Call the update function every 5 seconds
setInterval(updateISSLocation, 510000);

// Initial call to fetch the location immediately
updateISSLocation();
