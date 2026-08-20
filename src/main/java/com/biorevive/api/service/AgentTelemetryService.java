package com.biorevive.api.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AgentTelemetryService {

    private final Random random = new Random();

    // Simulated IoT Telemetry data generator for Software-based mode
    public Map<String, Object> getSimulatedTelemetry(String zoneId) {
        Map<String, Object> telemetry = new HashMap<>();
        telemetry.put("zoneId", zoneId);
        telemetry.put("soilMoisture", 15.5 + (35.0 - 15.5) * random.nextDouble()); // percentage
        telemetry.put("temperature", 28.0 + (42.0 - 28.0) * random.nextDouble()); // Celsius
        telemetry.put("npkLevel", "N: Low, P: Med, K: Optimal");
        telemetry.put("status", "Live Software Stream Active");
        return telemetry;
    }

    // Multi-Agent Swarm logic simulation (Geo-Sentinel, Bio-Botanist, ESG)
    public Map<String, Object> runAgentSwarm(String zoneId, String season) {
        Map<String, Object> report = new HashMap<>();
        report.put("zoneId", zoneId);
        report.put("geoSentinelStatus", "Severity Score: 78/100 (Degraded - High Erosion Risk)");
        
        if ("SUMMER".equalsIgnoreCase(season)) {
            report.put("bioBotanistRecommendation", "Recommended Drought-Resistant Flora: Prosopis cineraria, Neem, and Agave sisalana.");
        } else {
            report.put("monsoonBotanistRecommendation", "Recommended Native Broadleaf Flora: Ficus benghalensis, Azadirachta indica, and Bamboo.");
        }
        
        report.put("esgFinancialAgent", "Estimated Carbon Offset: 4.2 Tons CO2/year. Audit Hash: SHA-256-9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");
        return report;
    }
}