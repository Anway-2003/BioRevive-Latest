package com.biorevive.api.service; // Apne package name ke mutabik update karein

import org.springframework.stereotype.Service;

@Service
public class ESGFinancialAgent {

    public void calculateMetrics(SwarmContext context) {
        if ("CRITICAL_DEGRADATION".equals(context.getGeoSentinelThreatLevel())) {
            context.setEstimatedRestorationCost(15000.00); // Estimated INR
            context.setCarbonCreditPotential(4.2); // Tons CO2e / Year
        } else if ("MODERATE_STRESS".equals(context.getGeoSentinelThreatLevel())) {
            context.setEstimatedRestorationCost(6500.00);
            context.setCarbonCreditPotential(2.4);
        } else {
            context.setEstimatedRestorationCost(1200.00);
            context.setCarbonCreditPotential(0.8);
        }
    }
}