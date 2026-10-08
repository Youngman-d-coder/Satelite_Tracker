import { fetchISSObservation } from "./modules/api.js";
import { CONFIG } from "./modules/config.js";
import {
  formatAge,
  getObservationAgeMs,
  isStale,
} from "./modules/freshness.js";
import {
  createMapFollowState,
  markFirstFixApplied,
  shouldRecenterMap,
  toggleFollow,
} from "./modules/mapFollow.js";
import {
  classifyNetworkError,
  getConnectivityTransition,
} from "./modules/network.js";
import { RequestManager } from "./modules/requestManager.js";
import { formatTimestampFromAPI } from "./modules/time.js";
import { parseAndValidateObservation } from "./modules/validation.js";

const satelliteIcon = L.icon({
  iconUrl: "assets/satellite_icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -18],
});

const map = L.map("map").setView([0, 0], CONFIG.defaultZoom);
const issMarker = L.marker([0, 0], { icon: satelliteIcon }).addTo(map);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    maxZoom: CONFIG.maxZoom,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
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
  followToggle: document.getElementById("followToggle"),
};

const requestManager = new RequestManager();
let mapFollowState = createMapFollowState();
let lastObservationTimestampSec = null;
let dataStatus = "initializing";
let lastKnownOnlineState = navigator.onLine;

function debounce(func, delay) {
  let debounceTimer;

  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
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

function setDataStatus(statusText) {
  dataStatus = statusText;
  dom.dataStatus.textContent = statusText;
}

function updateConnectionState() {
  dom.connectionState.textContent = navigator.onLine ? "Online" : "Offline";
}

function updateFollowToggleUI() {
  const followLabel = mapFollowState.followEnabled ? "On" : "Off";
  dom.followToggle.textContent = `Follow ISS: ${followLabel}`;
  dom.followToggle.setAttribute(
    "aria-pressed",
    String(mapFollowState.followEnabled)
  );
}

function updateDataAgeUI() {
  const ageMs = getObservationAgeMs(lastObservationTimestampSec);

  dom.dataAge.textContent = formatAge(ageMs);
  if (
    dataStatus !== "loading" &&
    dataStatus !== "offline" &&
    isStale(ageMs, CONFIG.staleDataMs)
  ) {
    setDataStatus("stale");
  }
}

function applyObservationToUI(observation) {
  const latDisplay = observation.latitude.toFixed(4);
  const lngDisplay = observation.longitude.toFixed(4);

  issMarker.setLatLng([observation.latitude, observation.longitude]);
  issMarker.bindPopup(`Lat: ${latDisplay}, Lng: ${lngDisplay}`);

  if (shouldRecenterMap(mapFollowState)) {
    map.setView(
      [observation.latitude, observation.longitude],
      CONFIG.defaultZoom
    );
  }

  mapFollowState = markFirstFixApplied(mapFollowState);

  dom.latitude.textContent = latDisplay;
  dom.longitude.textContent = lngDisplay;
  dom.timestamp.textContent = formatTimestampFromAPI(observation.timestamp);

  lastObservationTimestampSec = observation.timestamp;
  setDataStatus("synced");
  updateDataAgeUI();
}

async function updateISSLocation() {
  const requestSequence = requestManager.beginRequest();
  dom.loadingSpinner.style.display = "block";
  setDataStatus("loading");
  updateConnectionState();

  try {
    const payload = await fetchISSObservation({
      apiUrl: CONFIG.apiUrl,
      timeoutMs: CONFIG.apiTimeoutMs,
      requester: (apiUrl, requestConfig) =>
        window.axios.get(apiUrl, requestConfig),
    });

    const observation = parseAndValidateObservation(payload);

    if (!observation) {
      setDataStatus("invalid-data");
      showNotification(
        "Received invalid satellite coordinates or timestamp from the provider.",
        "error"
      );
      return;
    }

    if (!requestManager.markApplied(requestSequence)) {
      return;
    }

    applyObservationToUI(observation);
  } catch (error) {
    console.error("Error fetching ISS location:", error);
    const classifiedError = classifyNetworkError(error, navigator.onLine);
    setDataStatus(classifiedError.status);
    showNotification(classifiedError.message, "error");
  } finally {
    dom.loadingSpinner.style.display = "none";
  }
}

const debouncedManualUpdate = debounce(
  updateISSLocation,
  CONFIG.debounceDelayMs
);

dom.refreshButton.addEventListener("click", debouncedManualUpdate);
dom.followToggle.addEventListener("click", () => {
  mapFollowState = toggleFollow(mapFollowState);
  updateFollowToggleUI();
});

window.addEventListener("online", () => {
  const transition = getConnectivityTransition(lastKnownOnlineState, true);
  lastKnownOnlineState = true;
  updateConnectionState();

  if (transition === "recovered") {
    showNotification(
      "Connection restored. Updating ISS location...",
      "success"
    );
  }

  updateISSLocation();
});

window.addEventListener("offline", () => {
  lastKnownOnlineState = false;
  updateConnectionState();
  setDataStatus("offline");
  showNotification(
    "You are offline. The map and data will not update.",
    "error"
  );
});

updateConnectionState();
updateFollowToggleUI();

if (!navigator.onLine) {
  setDataStatus("offline");
  showNotification(
    "You are offline. The map and data may not update.",
    "error"
  );
}

setInterval(updateISSLocation, CONFIG.updateIntervalMs);
setInterval(updateDataAgeUI, 1000);
updateISSLocation();
