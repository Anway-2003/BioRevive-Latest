package com.biorevive.api.controller;

import com.biorevive.api.service.AgentTelemetryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    @Autowired
    private AgentTelemetryService telemetryService;

    @GetMapping("/")
    public String home() {
        return "BioRevive Agentic AI Backend is Live and Running! 🚀";
    }

    @GetMapping("/telemetry/{zoneId}")
    public Map<String, Object> getTelemetry(@PathVariable("zoneId") String zoneId) {
        return telemetryService.getSimulatedTelemetry(zoneId);
    }

    @PostMapping("/run-swarm")
    public Map<String, Object> runSwarm(@RequestParam("zoneId") String zoneId, @RequestParam("season") String season) {
        return telemetryService.runAgentSwarm(zoneId, season);
    }
}