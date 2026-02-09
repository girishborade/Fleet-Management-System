package com.example.demo.Service;

import com.example.demo.dto.BookingDTO;
import com.example.demo.Repository.GetCarDetailsFromBooking;
import com.example.demo.Repository.projection.ReturnCarMasterDetailsFromBooking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class GetDetailsOfCarFromBookingService {

    @Autowired
    private com.example.demo.Repository.BookingRepository bookingRepository;

    @Autowired
    private com.example.demo.Repository.GetCarDetailsFromBooking getCarDetailsFromBookingRepoVariable;

    public List<ReturnCarMasterDetailsFromBooking> serviceOfGetCarDetailsFromBooking(BookingDTO bookingDTO) {
        String bookCar = bookingDTO.getBookcar();
        System.out.println("Booked Car is " + bookCar);
        return getCarDetailsFromBookingRepoVariable.GetDetailsOfCarFromBooking(bookCar);
    }

    public com.example.demo.Entity.CarMaster getCarDetailsByBookingId(Long bookingId) {
        com.example.demo.Entity.BookingHeaderTable booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null) {
            return booking.getCar();
        }
        return null;
    }
}
