package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.Service.JwtService;

@RestController
public class TestJwtController {

    @Autowired
    private JwtService jwtService;

    @GetMapping("/test-jwt")
    public String testJwt() {
        return jwtService.generateToken("testuser", "CUSTOMER");
    }
}
