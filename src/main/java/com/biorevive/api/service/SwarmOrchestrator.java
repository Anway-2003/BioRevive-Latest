package com.biorevive.api.service; // Apne package name ke mutabik update karein

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SwarmOrchestrator {

    private final GeoSentinelAgent geoSentinelAgent;
    private final BioBotanistAgent bioBotanistAgent;
    private final ESGFinancialAgent esgFinancialAgent;

    @Autowired
    public SwarmOrchestrator(GeoSentinelAgent geoSentinelAgent,
                             BioBotanistAgent bioBotanistAgent,
                             ESGFinancialAgent esgFinancialAgent) {
        this.geoSentinelAgent = geoSentinelAgent;
        this.bioBotanistAgent = bioBotanistAgent;
        this.esgFinancialAgent = esgFinancialAgent;
    }

    public SwarmContext executeSwarmCycle(SwarmContext context) {
        // Step 1: Scan & Detect Threat
        geoSentinelAgent.analyzeThreat(context);

        // Step 2: Biological & Restoration Planning
        bioBotanistAgent.determineRevivalPlan(context);

        // Step 3: ESG Financial & Carbon Accounting
        esgFinancialAgent.calculateMetrics(context);

        return context;
    }
}