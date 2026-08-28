package com.biorevive.api.service;


import com.biorevive.api.model.DeadZone;
import com.biorevive.api.repository.DeadZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DeadZoneAnalysisService {

    @Autowired
    private DeadZoneRepository deadZoneRepository;

    private static final String SUPABASE_STORAGE_BASE_URL = 
            "https://yytqlrffrezulmjhwhpx.supabase.co/storage/v1/object/public/dead-zone-images";

    // 🔬 Minimum diameter size constraint in meters (Ground Sample Distance calculated)
    private static final double MIN_DEAD_ZONE_DIAMETER_METERS = 20.0;

    /**
     * Pipeline to process satellite imagery with YOLOv8 CV & NDVI analysis.
     * Enforces the size constraint (< 20m discarded).
     */
    public Optional<DeadZone> processSatelliteZone(String hexId, double lat, double lng, double pixelWidth, double gsdMetersPerPixel, double ndviScore, double yoloConfidence, String sampleImageName) {
        
        // 1. Calculate diameter using Ground Sample Distance (GSD)
        double calculatedDiameterMeters = pixelWidth * gsdMetersPerPixel;

        // 2. 🚨 Size Constraint Filter: Discard detected anomaly if diameter < 20 meters
        if (calculatedDiameterMeters < MIN_DEAD_ZONE_DIAMETER_METERS) {
            System.out.println("[CV-Pipeline] Discarded detected anomaly for Hex " + hexId + 
                    ": Size (" + String.format("%.2f", calculatedDiameterMeters) + "m) is below 20m GSD threshold.");
            return Optional.empty();
        }

        // 3. Classify Generalized Risk Status
        String riskStatus = determineRiskStatus(ndviScore, yoloConfidence);

        // 4. Map Image URL to Supabase Cloud Bucket
        String cloudImageUrl = SUPABASE_STORAGE_BASE_URL + "/" + (sampleImageName != null ? sampleImageName : "satellite_hex_" + hexId + ".jpg");

        // 5. Persist to DB or return
        DeadZone deadZone = deadZoneRepository.findByHexId(hexId).orElseGet(DeadZone::new);
        deadZone.setHexId(hexId);
        deadZone.setLatitude(lat);
        deadZone.setLongitude(lng);
        deadZone.setRiskStatus(riskStatus);
        deadZone.setDiameterMeters(calculatedDiameterMeters);
        deadZone.setNdviScore(ndviScore);
        deadZone.setAnomalyConfidence(yoloConfidence);
        deadZone.setImageUrl(cloudImageUrl);

        return Optional.of(deadZoneRepository.save(deadZone));
    }

    /**
     * Determines generalized risk status: SAFE, WARNING, CRITICAL, DEAD
     */
    public String determineRiskStatus(double ndviScore, double yoloConfidence) {
        if (ndviScore < 0.10 && yoloConfidence > 0.70) {
            return "DEAD";
        } else if (ndviScore < 0.25 || yoloConfidence > 0.50) {
            return "CRITICAL";
        } else if (ndviScore < 0.45) {
            return "WARNING";
        } else {
            return "SAFE";
        }
    }

    /**
     * Retrieves or generates hexagonal grid data around latitude and longitude.
     */
    // In-memory cache for instant location search retrieval
    private final Map<String, List<Map<String, Object>>> locationCache = new java.util.concurrent.ConcurrentHashMap<>();

    /**
     * Generates real, high-resolution satellite imagery snapshot URL from Esri World Imagery REST service
     * for exact latitude and longitude coordinates.
     */
    private String generateRealSatelliteSnapshotUrl(double lat, double lng) {
        double offset = 0.003; // ~300m bounding box crop around dead zone target
        double minLng = lng - offset;
        double minLat = lat - offset;
        double maxLng = lng + offset;
        double maxLat = lat + offset;
        return String.format(Locale.US,
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=%.6f,%.6f,%.6f,%.6f&bboxSR=4326&imageSR=4326&size=800,500&f=image",
                minLng, minLat, maxLng, maxLat);
    }

    /**
     * Retrieves or generates hexagonal grid data around latitude and longitude.
     * Uses instant caching for repeat location searches.
     */
    public List<Map<String, Object>> getHexagonsForLocation(Double centerLat, Double centerLng) {
        double lat = (centerLat != null) ? centerLat : 18.5204; // Default Pune
        double lng = (centerLng != null) ? centerLng : 73.8567;

        String cacheKey = String.format(Locale.US, "%.3f_%.3f", lat, lng);
        if (locationCache.containsKey(cacheKey)) {
            System.out.println("[Cache-Hit] Instant retrieval for location: " + cacheKey);
            return locationCache.get(cacheKey);
        }

        List<Map<String, Object>> hexagonGrid = new ArrayList<>();

        // Create a 5x5 / 6x6 hexagonal grid layout around center (~25-37 hexagons)
        int gridSteps = 3;
        double stepLat = 0.015;
        double stepLng = 0.018;

        for (int i = -gridSteps; i <= gridSteps; i++) {
            for (int j = -gridSteps; j <= gridSteps; j++) {
                double hexLat = lat + (i * stepLat) + (j % 2 == 0 ? 0.0075 : 0);
                double hexLng = lng + (j * stepLng);

                // Create deterministic hex ID
                String hexId = String.format("8860b%05x", Math.abs(Objects.hash(hexLat, hexLng)));

                // Real ArcGIS World Imagery static satellite snapshot of exact coordinates
                String realSatelliteUrl = generateRealSatelliteSnapshotUrl(hexLat, hexLng);

                // Check DB for existing analysis
                Optional<DeadZone> existingZone = deadZoneRepository.findByHexId(hexId);

                String riskStatus;
                double diameterMeters;
                double ndviScore;
                String imageUrl;

                if (existingZone.isPresent()) {
                    DeadZone dz = existingZone.get();
                    riskStatus = dz.getRiskStatus();
                    diameterMeters = dz.getDiameterMeters();
                    ndviScore = dz.getNdviScore();
                    // Update image to real satellite URL if old image was stock photo
                    imageUrl = (dz.getImageUrl() != null && dz.getImageUrl().contains("unsplash")) ? realSatelliteUrl : dz.getImageUrl();
                    if (!imageUrl.equals(dz.getImageUrl())) {
                        dz.setImageUrl(imageUrl);
                        deadZoneRepository.save(dz);
                    }
                } else {
                    // Seed CV analysis results
                    double seedVal = (Math.abs((i * 13 + j * 7) % 100)) / 100.0;
                    diameterMeters = 25.0 + (seedVal * 120.0); // > 20 meters
                    
                    if (seedVal < 0.15) {
                        riskStatus = "DEAD";
                        ndviScore = 0.05 + (seedVal * 0.4);
                    } else if (seedVal < 0.35) {
                        riskStatus = "CRITICAL";
                        ndviScore = 0.18 + (seedVal * 0.3);
                    } else if (seedVal < 0.60) {
                        riskStatus = "WARNING";
                        ndviScore = 0.38 + (seedVal * 0.2);
                    } else {
                        riskStatus = "SAFE";
                        ndviScore = 0.65 + (seedVal * 0.3);
                    }
                    imageUrl = realSatelliteUrl;

                    // Save initial zone record into database
                    DeadZone newZone = new DeadZone(hexId, hexLat, hexLng, riskStatus, diameterMeters, ndviScore, 0.85, imageUrl);
                    deadZoneRepository.save(newZone);
                }

                Map<String, Object> cell = new HashMap<>();
                cell.put("hexId", hexId);
                cell.put("latitude", hexLat);
                cell.put("longitude", hexLng);
                cell.put("riskStatus", riskStatus);
                cell.put("diameterMeters", diameterMeters);
                cell.put("ndviScore", ndviScore);
                cell.put("imageUrl", imageUrl);

                hexagonGrid.add(cell);
            }
        }

        locationCache.put(cacheKey, hexagonGrid);
        return hexagonGrid;
    }

    public Optional<DeadZone> getZoneByHexId(String hexId) {
        return deadZoneRepository.findByHexId(hexId);
    }
}

