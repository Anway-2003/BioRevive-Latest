package com.biorevive.api.model;

import jakarta.persistence.*;

@Entity
public class DeadZone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String hexId;
    private Double latitude;
    private Double longitude;
    private String riskStatus;
    private Double diameterMeters;
    private Double ndviScore;
    private Double anomalyConfidence;
    
    @Column(length = 1000)
    private String imageUrl;

    // Default Constructor
    public DeadZone() {}

    // Parameterized Constructor
    public DeadZone(String hexId, Double latitude, Double longitude, String riskStatus, Double diameterMeters, Double ndviScore, Double anomalyConfidence, String imageUrl) {
        this.hexId = hexId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.riskStatus = riskStatus;
        this.diameterMeters = diameterMeters;
        this.ndviScore = ndviScore;
        this.anomalyConfidence = anomalyConfidence;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getHexId() { return hexId; }
    public void setHexId(String hexId) { this.hexId = hexId; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getRiskStatus() { return riskStatus; }
    public void setRiskStatus(String riskStatus) { this.riskStatus = riskStatus; }
    public Double getDiameterMeters() { return diameterMeters; }
    public void setDiameterMeters(Double diameterMeters) { this.diameterMeters = diameterMeters; }
    public Double getNdviScore() { return ndviScore; }
    public void setNdviScore(Double ndviScore) { this.ndviScore = ndviScore; }
    public Double getAnomalyConfidence() { return anomalyConfidence; }
    public void setAnomalyConfidence(Double anomalyConfidence) { this.anomalyConfidence = anomalyConfidence; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
