export async function getTraceData(traceId) {
  const response = await fetch(`http://localhost:1984/api/traces/${traceId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}
