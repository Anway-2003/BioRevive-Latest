import { useState, useEffect } from 'react';

// Current month se season nikalne ka helper
const getAutoSeason = () => {
  const month = new Date().getMonth() + 1; // 1 to 12
  if (month >= 3 && month <= 6) return "SUMMER";
  if (month >= 7 && month <= 9) return "MONSOON";
  if (month >= 10 && month <= 11) return "POST_MONSOON";
  return "WINTER";
};

export const useSwarmCycle = (zoneId, telemetryData) => {
  const [swarmInsights, setSwarmInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!telemetryData) return;

    const runCycle = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/swarm/execute/${zoneId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            soilMoisture: telemetryData.soilMoisture,
            temperature: telemetryData.temperature,
            npkStatus: telemetryData.npkLevel || "N: Low, P: Med, K: Optimal",
            currentSeason: getAutoSeason() // Dynamic Season sent to Java
          }),
        });
        const data = await response.json();
        setSwarmInsights(data);
      } catch (err) {
        console.error("Swarm trigger failed:", err);
      } finally {
        setLoading(false);
      }
    };

    runCycle();
  }, [zoneId, telemetryData]);

  return { swarmInsights, loading };
};