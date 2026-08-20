package com.biorevive.api.service;

import org.springframework.stereotype.Service;

@Service
public class BioBotanistAgent {

    public void determineRevivalPlan(SwarmContext context) {
        String season = context.getCurrentSeason() != null ? context.getCurrentSeason() : "MONSOON";
        String threat = context.getGeoSentinelThreatLevel();

        if ("CRITICAL_DEGRADATION".equals(threat)) {
            if ("MONSOON".equalsIgnoreCase(season)) {
                context.setRecommendedSpecies("Pioneer Native Trees (Neem, Pongamia, Peepal)");
                context.setCollectiveActionPlan("Active Monsoon Sapling Drive + Biochar Soil Infusion to prevent nutrient runoff");
            } else if ("SUMMER".equalsIgnoreCase(season)) {
                context.setRecommendedSpecies("Drought Resilient Vetiver Grass & Deep Mulch");
                context.setCollectiveActionPlan("Sub-surface Drip Irrigation + Shading Mats (Evaporation Control)");
            } else { // WINTER
                context.setRecommendedSpecies("Nitrogen-fixing Cover Crops (Legumes, Mustard)");
                context.setCollectiveActionPlan("Microbial Inoculation & Compost Bedding");
            }
        } else if ("MODERATE_STRESS".equals(threat)) {
            context.setRecommendedSpecies("Local Wild Flora & Shrubs");
            context.setCollectiveActionPlan("Soil Aeration & Rainwater Trench Bunding");
        } else {
            context.setRecommendedSpecies("Ecosystem Stable - Native Flora Thriving");
            context.setCollectiveActionPlan("Routine IoT Health Monitoring & Carbon Stock Auditing");
        }
    }
}