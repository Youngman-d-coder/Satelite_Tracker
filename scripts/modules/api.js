export async function fetchISSObservation({ apiUrl, timeoutMs, requester }) {
  const response = await requester(apiUrl, {
    timeout: timeoutMs,
  });

  return response?.data;
}
