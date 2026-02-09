package com.example.demo.dto;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;

public class FleetOverviewResponse {
    private List<HubFleetData> hubs;
    private FleetStatistics statistics;

    public List<HubFleetData> getHubs() {
        return hubs;
    }

    public void setHubs(List<HubFleetData> hubs) {
        this.hubs = hubs;
    }

    public FleetStatistics getStatistics() {
        return statistics;
    }

    public void setStatistics(FleetStatistics statistics) {
        this.statistics = statistics;
    }

    public static class HubFleetData {
        private int hubId;
        private String hubName;
        private String cityName;
        private List<CarStatusData> cars;
        private int totalCars;
        private int availableCars;
        private int rentedCars;
        private int maintenanceCars;

        public HubFleetData() {
        }

        public HubFleetData(int hubId, String hubName, String cityName, List<CarStatusData> cars, int totalCars,
                int availableCars, int rentedCars, int maintenanceCars) {
            this.hubId = hubId;
            this.hubName = hubName;
            this.cityName = cityName;
            this.cars = cars;
            this.totalCars = totalCars;
            this.availableCars = availableCars;
            this.rentedCars = rentedCars;
            this.maintenanceCars = maintenanceCars;
        }

        public int getHubId() {
            return hubId;
        }

        public void setHubId(int hubId) {
            this.hubId = hubId;
        }

        public String getHubName() {
            return hubName;
        }

        public void setHubName(String hubName) {
            this.hubName = hubName;
        }

        public String getCityName() {
            return cityName;
        }

        public void setCityName(String cityName) {
            this.cityName = cityName;
        }

        public List<CarStatusData> getCars() {
            return cars;
        }

        public void setCars(List<CarStatusData> cars) {
            this.cars = cars;
        }

        public int getTotalCars() {
            return totalCars;
        }

        public void setTotalCars(int totalCars) {
            this.totalCars = totalCars;
        }

        public int getAvailableCars() {
            return availableCars;
        }

        public void setAvailableCars(int availableCars) {
            this.availableCars = availableCars;
        }

        public int getRentedCars() {
            return rentedCars;
        }

        public void setRentedCars(int rentedCars) {
            this.rentedCars = rentedCars;
        }

        public int getMaintenanceCars() {
            return maintenanceCars;
        }

        public void setMaintenanceCars(int maintenanceCars) {
            this.maintenanceCars = maintenanceCars;
        }
    }

    public static class CarStatusData {
        private int carId;
        private String model;
        private String carType;
        private String registrationNumber;
        private String status;
        private Double dailyRate;
        private String imagePath;
        private RentalInfo currentRental;

        public CarStatusData() {
        }

        public CarStatusData(int carId, String model, String carType, String registrationNumber, String status,
                Double dailyRate, String imagePath, RentalInfo currentRental) {
            this.carId = carId;
            this.model = model;
            this.carType = carType;
            this.registrationNumber = registrationNumber;
            this.status = status;
            this.dailyRate = dailyRate;
            this.imagePath = imagePath;
            this.currentRental = currentRental;
        }

        public int getCarId() {
            return carId;
        }

        public void setCarId(int carId) {
            this.carId = carId;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public String getCarType() {
            return carType;
        }

        public void setCarType(String carType) {
            this.carType = carType;
        }

        public String getRegistrationNumber() {
            return registrationNumber;
        }

        public void setRegistrationNumber(String registrationNumber) {
            this.registrationNumber = registrationNumber;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Double getDailyRate() {
            return dailyRate;
        }

        public void setDailyRate(Double dailyRate) {
            this.dailyRate = dailyRate;
        }

        public String getImagePath() {
            return imagePath;
        }

        public void setImagePath(String imagePath) {
            this.imagePath = imagePath;
        }

        public RentalInfo getCurrentRental() {
            return currentRental;
        }

        public void setCurrentRental(RentalInfo currentRental) {
            this.currentRental = currentRental;
        }
    }

    public static class RentalInfo {
        private Long bookingId;
        private String customerName;
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDateTime pickupTime;

        public RentalInfo() {
        }

        public RentalInfo(Long bookingId, String customerName, LocalDate startDate, LocalDate endDate,
                LocalDateTime pickupTime) {
            this.bookingId = bookingId;
            this.customerName = customerName;
            this.startDate = startDate;
            this.endDate = endDate;
            this.pickupTime = pickupTime;
        }

        public Long getBookingId() {
            return bookingId;
        }

        public void setBookingId(Long bookingId) {
            this.bookingId = bookingId;
        }

        public String getCustomerName() {
            return customerName;
        }

        public void setCustomerName(String customerName) {
            this.customerName = customerName;
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

        public LocalDateTime getPickupTime() {
            return pickupTime;
        }

        public void setPickupTime(LocalDateTime pickupTime) {
            this.pickupTime = pickupTime;
        }
    }

    public static class FleetStatistics {
        private int totalCars;
        private int totalAvailable;
        private int totalRented;
        private int totalMaintenance;
        private double utilizationRate;

        public FleetStatistics() {
        }

        public FleetStatistics(int totalCars, int totalAvailable, int totalRented, int totalMaintenance,
                double utilizationRate) {
            this.totalCars = totalCars;
            this.totalAvailable = totalAvailable;
            this.totalRented = totalRented;
            this.totalMaintenance = totalMaintenance;
            this.utilizationRate = utilizationRate;
        }

        public int getTotalCars() {
            return totalCars;
        }

        public void setTotalCars(int totalCars) {
            this.totalCars = totalCars;
        }

        public int getTotalAvailable() {
            return totalAvailable;
        }

        public void setTotalAvailable(int totalAvailable) {
            this.totalAvailable = totalAvailable;
        }

        public int getTotalRented() {
            return totalRented;
        }

        public void setTotalRented(int totalRented) {
            this.totalRented = totalRented;
        }

        public int getTotalMaintenance() {
            return totalMaintenance;
        }

        public void setTotalMaintenance(int totalMaintenance) {
            this.totalMaintenance = totalMaintenance;
        }

        public double getUtilizationRate() {
            return utilizationRate;
        }

        public void setUtilizationRate(double utilizationRate) {
            this.utilizationRate = utilizationRate;
        }
    }
}
