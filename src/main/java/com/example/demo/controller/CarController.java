package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.CarService;

import java.util.List;

@RestController
@RequestMapping("api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class CarController {
    @Autowired
    private CarService carService;

    @GetMapping("cars")
    public ResponseEntity<List<Object[]>> getCarDetailsByHubAddress(@RequestParam String hubAddress) {
        List<Object[]> cars = carService.getCarsByHubAddress(hubAddress);
        return new ResponseEntity<>(cars, HttpStatus.OK);

    }
}
