package com.biorevive.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "dead_zones")
@Data
public class DeadZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String locationName; 
    private Double latitude;
    private Double longitude;
    
    private Double areaSize; 
    private Integer severityScore; 
    
    private String primaryCauses; 
    private String imageUrl; 
    private String status;
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getLocationName() {
		return locationName;
	}
	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	public Double getAreaSize() {
		return areaSize;
	}
	public void setAreaSize(Double areaSize) {
		this.areaSize = areaSize;
	}
	public Integer getSeverityScore() {
		return severityScore;
	}
	public void setSeverityScore(Integer severityScore) {
		this.severityScore = severityScore;
	}
	public String getPrimaryCauses() {
		return primaryCauses;
	}
	public void setPrimaryCauses(String primaryCauses) {
		this.primaryCauses = primaryCauses;
	}
	public String getImageUrl() {
		return imageUrl;
	}
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	} 
    
    
    
}