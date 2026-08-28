// 🔥 Fix: Render live backend URL as default, fallback or env support
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://biorevive-backend-6yij.onrender.com/api";

// 1. Fetch Live IoT Telemetry Data
export const fetchTelemetryData = async (zoneId = "zone1") => {
  try {
    const response = await fetch(`${API_BASE_URL}/agents/telemetry/${zoneId}`);
    if (!response.ok) throw new Error("Failed to fetch telemetry data");
    return await response.json();
  } catch (error) {
    console.error("Telemetry API Error:", error);
    return null;
  }
};

// 2. Fetch All Zones from Java Backend
export const fetchZones = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/zones`);
    if (!response.ok) throw new Error("Failed to fetch zones");
    return await response.json();
  } catch (error) {
    console.error("Zones API Error:", error);
    return [];
  }
};

// 3. Add New Zone to Java Backend (POST Request Fix)
export const createZone = async (zoneData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/zones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zoneData)
    });
    if (!response.ok) throw new Error("Failed to save zone in Java Backend");
    return await response.json();
  } catch (error) {
    console.error("Create Zone API Error:", error);
    throw error;
  }
};

// 4. Adopt Zone
export const adoptZone = async (zoneId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/zones/${zoneId}/adopt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error("Failed to adopt zone");
    return await response.json();
  } catch (error) {
    console.error("Adopt Zone API Error:", error);
    throw error;
  }
};

// 5. Fetch All Reports/Activities from Java Backend
export const fetchReports = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports`);
    if (!response.ok) throw new Error("Failed to fetch reports");
    return await response.json();
  } catch (error) {
    console.error("Reports API Error:", error);
    return [];
  }
};

// 6. Submit New Activity Report to Java Backend
export const submitReport = async (reportData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    if (!response.ok) throw new Error("Failed to save activity in Java Backend");
    return true;
  } catch (error) {
    console.error("Submit Report API Error:", error);
    throw error;
  }
};