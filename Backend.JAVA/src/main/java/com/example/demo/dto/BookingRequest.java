package com.example.demo.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.util.List;

@Data
public class BookingRequest {
    private int customerId;
    private int carId;
    private int pickupHubId;
    private int returnHubId;

    @JsonProperty("startDate")
    private java.time.LocalDate startDate;

    @JsonProperty("endDate")
    private java.time.LocalDate endDate;

    private List<Integer> addOnIds;
    private String email;
    private Long carTypeId;

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public int getCarId() {
        return carId;
    }

    public void setCarId(int carId) {
        this.carId = carId;
    }

    public int getPickupHubId() {
        return pickupHubId;
    }

    public void setPickupHubId(int pickupHubId) {
        this.pickupHubId = pickupHubId;
    }

    public int getReturnHubId() {
        return returnHubId;
    }

    public void setReturnHubId(int returnHubId) {
        this.returnHubId = returnHubId;
    }

    public java.time.LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(java.time.LocalDate startDate) {
        this.startDate = startDate;
    }

    public java.time.LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(java.time.LocalDate endDate) {
        this.endDate = endDate;
    }

    public List<Integer> getAddOnIds() {
        return addOnIds;
    }

    public void setAddOnIds(List<Integer> addOnIds) {
        this.addOnIds = addOnIds;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getCarTypeId() {
        return carTypeId;
    }

    public void setCarTypeId(Long carTypeId) {
        this.carTypeId = carTypeId;
    }
}
