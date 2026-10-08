export function classifyNetworkError(error, isOnline) {
  if (!isOnline) {
    return {
      status: "offline",
      message: "You are offline. Data updates are paused.",
    };
  }

  if (error?.code === "ECONNABORTED") {
    return {
      status: "timeout",
      message: "Request timed out. Please check your connection.",
    };
  }

  if (error?.response) {
    return {
      status: "api-error",
      message: `API Error: ${error.response.status}. Please try again later.`,
    };
  }

  if (error?.request) {
    return {
      status: "network-error",
      message: "No response from server. Please check your connection.",
    };
  }

  return {
    status: "error",
    message: "Failed to fetch ISS location. Please try again later.",
  };
}

export function getConnectivityTransition(previouslyOnline, currentlyOnline) {
  if (previouslyOnline === currentlyOnline) {
    return "unchanged";
  }

  return currentlyOnline ? "recovered" : "lost";
}
