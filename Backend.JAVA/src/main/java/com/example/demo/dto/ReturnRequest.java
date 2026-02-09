package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReturnRequest {
    private Long bookingId;
    private LocalDate returnDate;
    private String fuelStatus;
    private String notes;

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public String getFuelStatus() {
        return fuelStatus;
    }

    public void setFuelStatus(String fuelStatus) {
        this.fuelStatus = fuelStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
