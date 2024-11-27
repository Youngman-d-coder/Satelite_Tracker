// Satellite Tracker Application
// Developed by Nelson, Chimdiadi C.
// This script updates a map with the live location of the International Space Station (ISS) using the Open Notify API.

// Create a custom satellite icon for the map
const satelliteIcon = L.icon({
  iconUrl: "../assets/satellite_icon.png", // Path to the satellite icon image in the assets folder
  iconSize: [40, 40], // Dimensions of the icon (width and height in pixels)
  iconAnchor: [16, 16], // Position of the icon's center relative to its top-left corner
  popupAnchor: [0, -16], // Offset for the popup that appears above the icon
});

// Initialize the Leaflet map and set its initial view
const map = L.map("map").setView([0, 0], 2); // The map starts centered at latitude 0, longitude 0, with a zoom level showing the whole world

// Add a marker to represent the ISS's location on the map
const issMarker = L.marker([0, 0], { icon: satelliteIcon }).addTo(map);

// Add the base map layer (OpenStreetMap tiles) with proper attribution
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18, // Maximum zoom level allowed
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', // Acknowledgement for the map data source
}).addTo(map);

// Helper function to format UNIX timestamps into a human-readable date and time
function formatTimestampFromAPI(apiTimestamp) {
  const date = new Date(apiTimestamp * 1000); // Convert UNIX timestamp (seconds) to JavaScript's millisecond format
  return date.toLocaleString("en-US", {
    weekday: "short", // Show abbreviated weekday (e.g., Mon, Tue)
    year: "numeric", // Display the full year (e.g., 2024)
    month: "short", // Abbreviated month name (e.g., Jan, Feb)
    day: "numeric", // Day of the month (e.g., 1, 15)
    hour: "2-digit", // 2-digit hour in local time (e.g., 03, 12)
    minute: "2-digit", // 2-digit minutes (e.g., 05, 59)
    second: "2-digit", // 2-digit seconds (e.g., 00, 30)
  });
}

// Alert the user if their internet connection is offline
if (!navigator.onLine) {
  alert("You are offline. The map and data may not update."); // Displays a warning to ensure the user understands connectivity limitations
}

// Reference to the loading spinner element for indicating active data fetching
const loadingSpinner = document.getElementById("loading-spinner");

// Function to fetch and update the ISS's location on the map
async function updateISSLocation() {
  loadingSpinner.style.display = "block"; // Show the loading spinner while data is being fetched
  try {
    // Fetch the current ISS location and timestamp from the Open Notify API
    const response = await axios.get("http://api.open-notify.org/iss-now.json");
    const { latitude, longitude } = response.data.iss_position; // Extract latitude and longitude
    const apiTimestamp = response.data.timestamp; // Extract the timestamp

    // Update the marker position on the map and bind a popup with location data
    issMarker.setLatLng([latitude, longitude]);
    issMarker.bindPopup(`lat : ${latitude}, lng : ${longitude}`).openPopup();

    // Center the map view on the updated ISS location
    map.setView([latitude, longitude], 2);

    // Update the displayed latitude and longitude values on the webpage
    document.getElementById("latitude").textContent = latitude;
    document.getElementById("longitude").textContent = longitude;

    // Format the timestamp and update it on the webpage
    const formattedTimestamp = formatTimestampFromAPI(apiTimestamp);
    document.getElementById("timestamp").textContent = formattedTimestamp;
  } catch (error) {
    console.error("Error fetching ISS location:", error); // Log the error for debugging purposes
    alert("Failed to fetch the ISS location. Please try again later."); // Notify the user of any issues
  } finally {
    loadingSpinner.style.display = "none"; // Hide the loading spinner once data fetching is complete
  }
}

// Reference to the refresh button on the webpage
const refreshButton = document.getElementById("refreshButton");

// Attach a click event listener to the refresh button to allow manual updates
refreshButton.addEventListener("click", () => {
  updateISSLocation(); // Fetch and display the updated ISS location
});

// Set up an interval to automatically refresh the ISS location every 8.5 minutes (510 seconds)
setInterval(updateISSLocation, 510000);

// Fetch and display the ISS location immediately upon page load
updateISSLocation();
