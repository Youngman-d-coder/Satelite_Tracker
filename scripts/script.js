const CONFIG = {
  API_URL: "https://api.wheretheiss.at/v1/satellites/25544",
  UPDATE_INTERVAL: 5 * 60 * 1000,
  API_TIMEOUT: 10000,
  DEFAULT_ZOOM: 2,
  MAX_ZOOM: 18,
  DEBOUNCE_DELAY: 1000,
  STALE_DATA_MS: 10 * 60 * 1000,
};

const satelliteIcon = L.icon({
  iconUrl: "assets/satellite_icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -18],
});

const map = L.map("map").setView([0, 0], CONFIG.DEFAULT_ZOOM);
const issMarker = L.marker([0, 0], { icon: satelliteIcon }).addTo(map);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    maxZoom: CONFIG.MAX_ZOOM,
    attribution:
      "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
  }
).addTo(map);

const dom = {
  latitude: document.getElementById("latitude"),
  longitude: document.getElementById("longitude"),
  timestamp: document.getElementById("timestamp"),
  connectionState: document.getElementById("connection-state"),
  dataStatus: document.getElementById("data-status"),
  dataAge: document.getElementById("data-age"),
  loadingSpinner: document.getElementById("loading-spinner"),
  refreshButton: document.getElementById("refreshButton"),
};

const state = {
  requestSequence: 0,
  latestAppliedRequestSequence: 0,
  isFirstFixApplied: false,
  lastSuccessfulFetchMs: null,
  lastObservationTimestampSec: null,
  status: "initializing",
};

function formatTimestampFromAPI(apiTimestampSec) {
  const date = new Date(apiTimestampSec * 1000);
  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatAge(ageMs) {
  if (!Number.isFinite(ageMs) || ageMs < 0) {
    return "-";
  }
  const totalSeconds = Math.floor(ageMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

function showNotification(message, type = "error") {
  const notificationDiv = document.createElement("div");
  notificationDiv.className = `notification-message ${type}`;
  notificationDiv.textContent = message;
  document.body.appendChild(notificationDiv);

  setTimeout(() => {
    notificationDiv.remove();
  }, 5000);
}

function parseFiniteNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseAndValidateObservation(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const latitude = parseFiniteNumber(payload.latitude);
  const longitude = parseFiniteNumber(payload.longitude);
  const timestamp = parseFiniteNumber(payload.timestamp);

  if (latitude === null || longitude === null || timestamp === null) {
    return null;
  }
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null;
  }
  if (timestamp <= 0) {
    return null;
  }

  return { latitude, longitude, timestamp };
}

function setDataStatus(statusText) {
  state.status = statusText;
  dom.dataStatus.textContent = statusText;
}

function updateConnectionState() {
  dom.connectionState.textContent = navigator.onLine ? "Online" : "Offline";
}

function updateDataAgeUI() {
  if (!state.lastObservationTimestampSec) {
    dom.dataAge.textContent = "-";
    return;
  }

  const observationAgeMs =
    Date.now() - state.lastObservationTimestampSec * 1000;
  dom.dataAge.textContent = formatAge(observationAgeMs);

  if (
    state.status !== "loading" &&
    state.status !== "offline" &&
    observationAgeMs > CONFIG.STALE_DATA_MS
  ) {
    setDataStatus("stale");
  }
}

let debounceTimer;
function debounce(func, delay) {
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}

function applyObservationToUI(observation, options = {}) {
  const { recenter = false } = options;

  const latDisplay = observation.latitude.toFixed(4);
  const lngDisplay = observation.longitude.toFixed(4);

  issMarker.setLatLng([observation.latitude, observation.longitude]);
  issMarker.bindPopup(`Lat: ${latDisplay}, Lng: ${lngDisplay}`);

  if (recenter || !state.isFirstFixApplied) {
    map.setView(
      [observation.latitude, observation.longitude],
      CONFIG.DEFAULT_ZOOM
    );
  }

  dom.latitude.textContent = latDisplay;
  dom.longitude.textContent = lngDisplay;
  dom.timestamp.textContent = formatTimestampFromAPI(observation.timestamp);

  state.lastSuccessfulFetchMs = Date.now();
  state.lastObservationTimestampSec = observation.timestamp;
  state.isFirstFixApplied = true;
  setDataStatus("synced");
  updateDataAgeUI();
}

async function updateISSLocation(options = {}) {
  const { recenter = false } = options;
  const requestSequence = ++state.requestSequence;
  dom.loadingSpinner.style.display = "block";
  setDataStatus("loading");
  updateConnectionState();

  try {
    const response = await axios.get(CONFIG.API_URL, {
      timeout: CONFIG.API_TIMEOUT,
    });
    const observation = parseAndValidateObservation(response.data);

    if (!observation) {
      setDataStatus("invalid-data");
      showNotification(
        "Received invalid satellite coordinates or timestamp from the provider.",
        "error"
      );
      return;
    }

    if (requestSequence < state.latestAppliedRequestSequence) {
      return;
    }

    state.latestAppliedRequestSequence = requestSequence;
    applyObservationToUI(observation, { recenter });
  } catch (error) {
    console.error("Error fetching ISS location:", error);

    if (!navigator.onLine) {
      setDataStatus("offline");
      showNotification("You are offline. Data updates are paused.", "error");
    } else if (error.code === "ECONNABORTED") {
      setDataStatus("timeout");
      showNotification(
        "Request timed out. Please check your connection.",
        "error"
      );
    } else if (error.response) {
      setDataStatus("api-error");
      showNotification(
        `API Error: ${error.response.status}. Please try again later.`,
        "error"
      );
    } else if (error.request) {
      setDataStatus("network-error");
      showNotification(
        "No response from server. Please check your connection.",
        "error"
      );
    } else {
      setDataStatus("error");
      showNotification(
        "Failed to fetch ISS location. Please try again later.",
        "error"
      );
    }
  } finally {
    dom.loadingSpinner.style.display = "none";
  }
}

const debouncedUpdate = debounce(() => {
  updateISSLocation({ recenter: true });
}, CONFIG.DEBOUNCE_DELAY);

dom.refreshButton.addEventListener("click", debouncedUpdate);

window.addEventListener("online", () => {
  updateConnectionState();
  showNotification("Connection restored. Updating ISS location...", "success");
  updateISSLocation({ recenter: false });
});

window.addEventListener("offline", () => {
  updateConnectionState();
  setDataStatus("offline");
  showNotification(
    "You are offline. The map and data will not update.",
    "error"
  );
});

updateConnectionState();
if (!navigator.onLine) {
  setDataStatus("offline");
  showNotification(
    "You are offline. The map and data may not update.",
    "error"
  );
}

setInterval(() => {
  updateISSLocation({ recenter: false });
}, CONFIG.UPDATE_INTERVAL);

setInterval(updateDataAgeUI, 1000);
updateISSLocation({ recenter: true });
