package com.biorevive.api.service;



import org.springframework.stereotype.Service;

@Service
public class GeoSentinelAgent {

    public void analyzeThreat(SwarmContext context) {
        String season = context.getCurrentSeason() != null ? context.getCurrentSeason() : "MONSOON";
        double moisture = context.getSoilMoisture();
        String npk = context.getNpkStatus() != null ? context.getNpkStatus() : "";

        boolean isNutrientDepleted = npk.toLowerCase().contains("low");

        if ("MONSOON".equalsIgnoreCase(season)) {
            // Monsoon logic: Greenery ho sakti hai, par agar nutrient low hain aur moisture < 45%, to zameen dead hai
            if (moisture < 45.0 || isNutrientDepleted) {
                context.setGeoSentinelThreatLevel("CRITICAL_DEGRADATION");
            } else if (moisture < 65.0) {
                context.setGeoSentinelThreatLevel("MODERATE_STRESS");
            } else {
                context.setGeoSentinelThreatLevel("STABLE");
            }
        } 
        else if ("SUMMER".equalsIgnoreCase(season)) {
            // Summer logic: Low moisture expected hai, extreme drought check karo
            if (moisture < 15.0 && isNutrientDepleted) {
                context.setGeoSentinelThreatLevel("CRITICAL_DEGRADATION");
            } else if (moisture < 25.0) {
                context.setGeoSentinelThreatLevel("MODERATE_STRESS");
            } else {
                context.setGeoSentinelThreatLevel("STABLE");
            }
        } 
        else { // WINTER / POST-MONSOON
            if (moisture < 25.0 || isNutrientDepleted) {
                context.setGeoSentinelThreatLevel("MODERATE_STRESS");
            } else {
                context.setGeoSentinelThreatLevel("STABLE");
            }
        }
    }
}
