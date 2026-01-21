package com.example.demo.controller;




import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {


    @PostMapping("/storeDates")
    public String storeBookingDates(@RequestParam String start_date, @RequestParam String end_date , @RequestParam int cust_id) {

        DateTimeFormatter dateTimeFormatter =  DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime rentalDate = LocalDateTime.parse(start_date,dateTimeFormatter);
        LocalDateTime returnDate = LocalDateTime.parse(end_date,dateTimeFormatter);
//
//        return initialDateService.storeTempDateandTime(rentalDate,returnDate,cust_id);
        return "success";
    }

}
