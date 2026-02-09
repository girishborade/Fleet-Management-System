package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingResponse {
    private Long bookingId;
    private String confirmationNumber;
    private String bookingStatus;
    private String customerName;
    private String email;
    private String carName;
    private String numberPlate;
    private String pickupHub;
    private Long pickupHubId; // Added for internal logic
    private String returnHub;
    private Long carTypeId; // Added for filtering
    private LocalDate startDate;
    private LocalDate endDate;
    private Double dailyRate;
    private Double totalAmount; // Optional, if calculated
    private Double totalAddonAmount;
    private java.util.List<String> selectedAddOns;

    // Customer Details for Handover
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String phoneNumber;
    private String mobileNumber;
    private String drivingLicenseNumber;
    private LocalDate dateOfBirth;
    private String passportNumber;

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getConfirmationNumber() {
        return confirmationNumber;
    }

    public void setConfirmationNumber(String confirmationNumber) {
        this.confirmationNumber = confirmationNumber;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCarName() {
        return carName;
    }

    public void setCarName(String carName) {
        this.carName = carName;
    }

    public String getNumberPlate() {
        return numberPlate;
    }

    public void setNumberPlate(String numberPlate) {
        this.numberPlate = numberPlate;
    }

    public String getPickupHub() {
        return pickupHub;
    }

    public void setPickupHub(String pickupHub) {
        this.pickupHub = pickupHub;
    }

    public Long getPickupHubId() {
        return pickupHubId;
    }

    public void setPickupHubId(Long pickupHubId) {
        this.pickupHubId = pickupHubId;
    }

    public String getReturnHub() {
        return returnHub;
    }

    public void setReturnHub(String returnHub) {
        this.returnHub = returnHub;
    }

    public Long getCarTypeId() {
        return carTypeId;
    }

    public void setCarTypeId(Long carTypeId) {
        this.carTypeId = carTypeId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Double getDailyRate() {
        return dailyRate;
    }

    public void setDailyRate(Double dailyRate) {
        this.dailyRate = dailyRate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Double getTotalAddonAmount() {
        return totalAddonAmount;
    }

    public void setTotalAddonAmount(Double totalAddonAmount) {
        this.totalAddonAmount = totalAddonAmount;
    }

    public java.util.List<String> getSelectedAddOns() {
        return selectedAddOns;
    }

    public void setSelectedAddOns(java.util.List<String> selectedAddOns) {
        this.selectedAddOns = selectedAddOns;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getDrivingLicenseNumber() {
        return drivingLicenseNumber;
    }

    public void setDrivingLicenseNumber(String drivingLicenseNumber) {
        this.drivingLicenseNumber = drivingLicenseNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }
}
