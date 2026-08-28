import { useState, useEffect } from 'react';

// 🔥 Fix: Render live backend URL used here!
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://biorevive-backend-6yij.onrender.com/api";

export const useSwarmCycle = (zoneId, telemetry) => {
  const [swarmInsights, setSwarmInsights] = useState(null);

  useEffect(() => {
    if (!zoneId) return;

    const runCycle = async () => {
      try {
        // 🔥 Localhost kadhun API_BASE_URL takla ahe
        const response = await fetch(`${API_BASE_URL}/swarm/execute/${zoneId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(telemetry || {}) // Telemetry data pathavla
        });

        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await response.json();
        setSwarmInsights(data);
      } catch (error) {
        console.error('Swarm trigger failed:', error);
      }
    };

    runCycle();
    
    // Auto-update every 10 seconds (optional)
    const intervalId = setInterval(runCycle, 10000);
    return () => clearInterval(intervalId);

  }, [zoneId, telemetry]);

  return { swarmInsights };
};