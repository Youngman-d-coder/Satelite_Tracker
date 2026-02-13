// Satellite Tracker Application
// Developed by Nelson, Chimdiadi C.
// This script updates a map with the live location of the International Space Station (ISS) using the Open Notify API.

// Configuration constants
const CONFIG = {
  API_URL: "https://api.open-notify.org/iss-now.json",
  UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes in milliseconds
  API_TIMEOUT: 10000, // 10 seconds timeout for API requests
  DEFAULT_ZOOM: 2,
  MAX_ZOOM: 18,
  DEBOUNCE_DELAY: 1000, // 1 second debounce for manual refresh
};

// Create a custom satellite icon for the map
const satelliteIcon = L.icon({
  iconUrl: "assets/satellite_icon.png", // Path to the satellite icon image in the assets folder
  iconSize: [40, 40], // Dimensions of the icon (width and height in pixels)
  iconAnchor: [16, 16], // Position of the icon's center relative to its top-left corner
  popupAnchor: [0, -16], // Offset for the popup that appears above the icon
});

// Initialize the Leaflet map and set its initial view
const map = L.map("map").setView([0, 0], CONFIG.DEFAULT_ZOOM); // The map starts centered at latitude 0, longitude 0, with a zoom level showing the whole world

// Add a marker to represent the ISS's location on the map
const issMarker = L.marker([0, 0], { icon: satelliteIcon }).addTo(map);

// Add the base map layer (OpenStreetMap tiles) with proper attribution
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: CONFIG.MAX_ZOOM, // Maximum zoom level allowed
  attribution:
    "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors", // Acknowledgement for the map data source
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

// Alert the user if their internet connection is offline on page load
if (!navigator.onLine) {
  showNotification(
    "You are offline. The map and data may not update.",
    "error"
  );
}

// Reference to the loading spinner element for indicating active data fetching
const loadingSpinner = document.getElementById("loading-spinner");

// Debounce function to prevent rapid successive API calls
let debounceTimer;
function debounce(func, delay) {
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Function to display user-friendly notifications
function showNotification(message, type = "error") {
  const notificationDiv = document.createElement("div");
  notificationDiv.className = `notification-message ${type}`;
  notificationDiv.textContent = message;

  const backgroundColor = type === "error" ? "#f44336" : "#4caf50";
  notificationDiv.style.cssText = `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: ${backgroundColor}; color: white; padding: 15px 30px; border-radius: 5px; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.3);`;

  document.body.appendChild(notificationDiv);

  // Auto-remove notification after 5 seconds
  setTimeout(() => {
    notificationDiv.remove();
  }, 5000);
}

// Function to fetch and update the ISS's location on the map
async function updateISSLocation() {
  loadingSpinner.style.display = "block"; // Show the loading spinner while data is being fetched
  try {
    // Fetch the current ISS location and timestamp from the Open Notify API with timeout
    const response = await axios.get(CONFIG.API_URL, {
      timeout: CONFIG.API_TIMEOUT,
    });
    const { latitude, longitude } = response.data.iss_position; // Extract latitude and longitude
    const apiTimestamp = response.data.timestamp; // Extract the timestamp

    // Update the marker position on the map
    issMarker.setLatLng([latitude, longitude]);
    issMarker.bindPopup(`Lat: ${latitude}, Lng: ${longitude}`);

    // Center the map view on the updated ISS location
    map.setView([latitude, longitude], CONFIG.DEFAULT_ZOOM);

    // Update the displayed latitude and longitude values on the webpage
    document.getElementById("latitude").textContent = latitude;
    document.getElementById("longitude").textContent = longitude;

    // Format the timestamp and update it on the webpage
    const formattedTimestamp = formatTimestampFromAPI(apiTimestamp);
    document.getElementById("timestamp").textContent = formattedTimestamp;
  } catch (error) {
    console.error("Error fetching ISS location:", error); // Log the error for debugging purposes

    // Provide specific error messages based on error type
    if (error.code === "ECONNABORTED") {
      showNotification(
        "Request timed out. Please check your internet connection.",
        "error"
      );
    } else if (error.response) {
      showNotification(
        `API Error: ${error.response.status}. Please try again later.`,
        "error"
      );
    } else if (error.request) {
      showNotification(
        "No response from server. Please check your connection.",
        "error"
      );
    } else {
      showNotification(
        "Failed to fetch ISS location. Please try again later.",
        "error"
      );
    }
  } finally {
    loadingSpinner.style.display = "none"; // Hide the loading spinner once data fetching is complete
  }
}

// Reference to the refresh button on the webpage
const refreshButton = document.getElementById("refreshButton");

// Attach a click event listener to the refresh button with debouncing
const debouncedUpdate = debounce(updateISSLocation, CONFIG.DEBOUNCE_DELAY);
refreshButton.addEventListener("click", () => {
  debouncedUpdate(); // Fetch and display the updated ISS location with debouncing
});

// Monitor online/offline status changes
window.addEventListener("online", () => {
  showNotification("Connection restored. Updating ISS location...", "success");
  updateISSLocation();
});

window.addEventListener("offline", () => {
  showNotification(
    "You are offline. The map and data will not update.",
    "error"
  );
});

// Set up an interval to automatically refresh the ISS location
setInterval(updateISSLocation, CONFIG.UPDATE_INTERVAL);

// Fetch and display the ISS location immediately upon page load
updateISSLocation();
