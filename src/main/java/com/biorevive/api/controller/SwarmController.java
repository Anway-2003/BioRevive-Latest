package com.biorevive.api.controller;

 import com.biorevive.api.service.SwarmContext;
import com.biorevive.api.service.SwarmOrchestrator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/swarm")
@CrossOrigin(origins = "*")
public class SwarmController {

    private final SwarmOrchestrator orchestrator;

    @Autowired
    public SwarmController(SwarmOrchestrator orchestrator) {
        this.orchestrator = orchestrator;
    }

    @PostMapping("/execute/{zoneId}")
    public ResponseEntity<SwarmContext> triggerAgenticLoop(
            @PathVariable String zoneId,
            @RequestBody SwarmContext context) {
        
        context.setZoneId(zoneId);
        SwarmContext result = orchestrator.executeSwarmCycle(context);
        return ResponseEntity.ok(result);
    }
}