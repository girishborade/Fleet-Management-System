package com.example.demo.controller;

import com.example.demo.dto.BookingDTO;
import com.example.demo.Repository.CheckCustomerExistsRepository;
import com.example.demo.Service.CheckCustomerExistsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// @RequestMapping("ap1/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerExistsController {
    @Autowired
    private CheckCustomerExistsService checkCustomerExistsService;

    @PostMapping("/createBooking")

    public ResponseEntity<String> createBookingController(@RequestBody BookingDTO bookingDTO) {

        String result = checkCustomerExistsService.createBooking(bookingDTO);

        if (result.equals("You can continue with booking")) {

            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {

            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        }
    }

    @org.springframework.web.bind.annotation.GetMapping("/customers/exists/{email}")
    public ResponseEntity<Boolean> CheckExists(@org.springframework.web.bind.annotation.PathVariable String email) {
        return new ResponseEntity<>(checkCustomerExistsService.CustomerExistsAsync(email), HttpStatus.OK);
    }
}
