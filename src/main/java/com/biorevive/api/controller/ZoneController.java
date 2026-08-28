package com.biorevive.api.controller;

import com.biorevive.api.model.Zone;
import com.biorevive.api.repository.ZoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zones")
@CrossOrigin(origins = "*")
public class ZoneController {

    @Autowired
    private ZoneRepository zoneRepository;

    // 1. Get All Zones 
    @GetMapping
    public List<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    // 2. Add New Zone 
    @PostMapping
    public Zone createZone(@RequestBody Zone zone) {
        return zoneRepository.save(zone);
    }
    
    // 3. Adopt Zone (Fixed to return proper JSON map)
    @PostMapping("/{id}/adopt")
    public ResponseEntity<?> adoptZone(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        Zone zone = zoneRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Zone not found with id: " + id));
        
        zone.setStatus("Adopted"); 
        zoneRepository.save(zone);
        
        // 🔥 Return JSON instead of plain text to avoid frontend fetch crash
        return ResponseEntity.ok(Map.of("message", "Zone Adopted Successfully", "id", id));
    }
}