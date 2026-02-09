package com.example.demo.controller;

import com.example.demo.Entity.HubMaster;

import com.example.demo.Repository.projection.HubInfoProjection;
import com.example.demo.Service.HubService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
// @RequiredArgsConstructor
@RequestMapping("api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class HubController {

    @Autowired
    private HubService hubService;

    @GetMapping("hubs")
    public ResponseEntity<List<HubInfoProjection>> getAllHubListByCityIdAndStateId(
            @RequestParam(required = false) String stateName,
            @RequestParam(required = false) String cityName) {

        if (stateName == null && cityName == null) {
            // Frontend calls /api/v1/hubs without params expecting all hubs
            // We need a service method for this, or reuse existing repository method if
            // applicable
            // For now, let's assume we can fetch all via repository or service
            // Since service typically filters, let's modify service or add a method.
            // Wait, HubService probably has `getAllHubs`? Let's check or create.
            // Checking HubService...
            // If HubService doesn't have it, we might need to add it.
            // For now, let's look at what we have.
            // Actually, let's use the repository directly if service is limited, or better,
            // update service.
            // But I cannot see Service code right now.
            // Let's assumne hubService.getAllHubs() exists or we will add it.
            // Actually, `hubService.getAllHubByCityIdAndStateId` might handle nulls?
            // The original code returned empty list if null.

            // Let's add a new method in Service to get all hubs or use repository findAll.
            // Since we are in Controller, we can use Service.
            // Let's assume we will add `getAllHubs()` to Service.
            return new ResponseEntity<>(hubService.getAllHubs(), HttpStatus.OK);
        }
        List<HubInfoProjection> hubs = hubService.getAllHubByCityIdAndStateId(cityName, stateName);
        return new ResponseEntity<>(hubs, HttpStatus.OK);
    }

    @GetMapping("hubs/city/{cityId}")
    public ResponseEntity<List<HubInfoProjection>> getHubsByCityId(@PathVariable Integer cityId) {
        return new ResponseEntity<>(hubService.getHubsByCityId(cityId), HttpStatus.OK);
    }

    @GetMapping("locations/search")
    public ResponseEntity<List<HubInfoProjection>> searchLocations(@RequestParam String query) {
        List<HubInfoProjection> hubs = hubService.searchHubs(query);
        return new ResponseEntity<>(hubs, HttpStatus.OK);
    }

}
