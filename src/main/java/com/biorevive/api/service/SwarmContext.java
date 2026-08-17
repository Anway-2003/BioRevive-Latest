package com.biorevive.api.service;

public class SwarmContext {

    private String zoneId;
    private double soilMoisture;
    private double temperature;
    private String npkStatus;
    private String currentSeason;
    private String geoSentinelThreatLevel;
    private String recommendedSpecies;
    private String collectiveActionPlan;
    private double carbonCreditPotential;
    private double estimatedRestorationCost;

    public SwarmContext() {
    }

    public SwarmContext(String zoneId, double soilMoisture, double temperature, String npkStatus, String currentSeason) {
        this.zoneId = zoneId;
        this.soilMoisture = soilMoisture;
        this.temperature = temperature;
        this.npkStatus = npkStatus;
        this.currentSeason = currentSeason;
    }

    // Getters and Setters
    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public double getSoilMoisture() {
        return soilMoisture;
    }

    public void setSoilMoisture(double soilMoisture) {
        this.soilMoisture = soilMoisture;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public String getNpkStatus() {
        return npkStatus;
    }

    public void setNpkStatus(String npkStatus) {
        this.npkStatus = npkStatus;
    }

    public String getCurrentSeason() {
        return currentSeason;
    }

    public void setCurrentSeason(String currentSeason) {
        this.currentSeason = currentSeason;
    }

    public String getGeoSentinelThreatLevel() {
        return geoSentinelThreatLevel;
    }

    public void setGeoSentinelThreatLevel(String geoSentinelThreatLevel) {
        this.geoSentinelThreatLevel = geoSentinelThreatLevel;
    }

    public String getRecommendedSpecies() {
        return recommendedSpecies;
    }

    public void setRecommendedSpecies(String recommendedSpecies) {
        this.recommendedSpecies = recommendedSpecies;
    }

    public String getCollectiveActionPlan() {
        return collectiveActionPlan;
    }

    public void setCollectiveActionPlan(String collectiveActionPlan) {
        this.collectiveActionPlan = collectiveActionPlan;
    }

    public double getCarbonCreditPotential() {
        return carbonCreditPotential;
    }

    public void setCarbonCreditPotential(double carbonCreditPotential) {
        this.carbonCreditPotential = carbonCreditPotential;
    }

    public double getEstimatedRestorationCost() {
        return estimatedRestorationCost;
    }

    public void setEstimatedRestorationCost(double estimatedRestorationCost) {
        this.estimatedRestorationCost = estimatedRestorationCost;
    }
}