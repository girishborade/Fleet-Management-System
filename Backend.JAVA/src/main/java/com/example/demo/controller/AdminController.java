package com.example.demo.controller;

import com.example.demo.Service.ExcelUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.List;
import com.example.demo.Service.BookingService;
import com.example.demo.dto.BookingResponse;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Adjust for frontend port
public class AdminController {

    @Autowired
    private ExcelUploadService excelUploadService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private com.example.demo.Repository.UserRepository userRepository;

    @Autowired
    private com.example.demo.Repository.HubRepository hubRepository;

    @Autowired
    private com.example.demo.Repository.CarRepository carRepository;

    @Autowired
    private com.example.demo.Repository.BookingRepository bookingRepository;

    @Autowired
    private com.example.demo.Service.UserService userService;

    @PostMapping("/upload-rates")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (excelUploadService == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Service not initialized"));
        }

        String message = "";
        try {
            excelUploadService.saveCarTypes(file);
            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", message));
        } catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + ". Error: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("message", message));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/fleet-overview")
    public ResponseEntity<com.example.demo.dto.FleetOverviewResponse> getFleetOverview(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        try {
            List<com.example.demo.Entity.CarMaster> cars = carRepository.findAll();

            List<com.example.demo.Entity.BookingHeaderTable> relevantBookings;

            if (startDate != null && endDate != null) {
                java.time.LocalDate start = java.time.LocalDate.parse(startDate);
                java.time.LocalDate end = java.time.LocalDate.parse(endDate);
                relevantBookings = bookingRepository.findBookingsByDateRange(start, end);
            } else {
                relevantBookings = bookingRepository.findByBookingStatus("ACTIVE");
            }

            // Group cars by hub
            Map<Integer, List<com.example.demo.Entity.CarMaster>> carsByHub = cars.stream()
                    .filter(c -> c.getHub() != null)
                    .collect(java.util.stream.Collectors.groupingBy(c -> c.getHub().getHubId()));

            List<com.example.demo.dto.FleetOverviewResponse.HubFleetData> hubFleetDataList = new java.util.ArrayList<>();

            for (Map.Entry<Integer, List<com.example.demo.Entity.CarMaster>> entry : carsByHub.entrySet()) {
                Integer hubId = entry.getKey();
                List<com.example.demo.Entity.CarMaster> hubCars = entry.getValue();

                if (hubCars.isEmpty())
                    continue;

                com.example.demo.Entity.HubMaster hub = hubCars.get(0).getHub();

                List<com.example.demo.dto.FleetOverviewResponse.CarStatusData> carStatusList = new java.util.ArrayList<>();

                for (com.example.demo.Entity.CarMaster car : hubCars) {
                    String status = "Available";
                    com.example.demo.dto.FleetOverviewResponse.RentalInfo rentalInfo = null;

                    com.example.demo.Entity.BookingHeaderTable booking = relevantBookings.stream()
                            .filter(b -> b.getCar() != null && b.getCar().getCarId() == car.getCarId())
                            .filter(b -> {
                                // If no date range provided (current status view), only consider bookings
                                // active TODAY
                                if (startDate == null) {
                                    java.time.LocalDate today = java.time.LocalDate.now();
                                    return (today.isEqual(b.getStartDate()) || today.isAfter(b.getStartDate())) &&
                                            (today.isEqual(b.getEndDate()) || today.isBefore(b.getEndDate()));
                                }
                                return true; // If date range provided, relevantBookings is already filtered
                            })
                            .findFirst()
                            .orElse(null);

                    if (booking != null) {
                        status = "Rented";
                        rentalInfo = new com.example.demo.dto.FleetOverviewResponse.RentalInfo(
                                booking.getBookingId(),
                                booking.getFirstName() + " " + booking.getLastName(),
                                booking.getStartDate(),
                                booking.getEndDate(),
                                booking.getPickupTime());
                    } else if (car.getIsAvailable() == com.example.demo.Entity.CarMaster.AvailabilityStatus.N ||
                            car.getIsAvailable() == com.example.demo.Entity.CarMaster.AvailabilityStatus.NO) {
                        if (startDate == null) {
                            status = "Maintenance";
                        }
                    }

                    carStatusList.add(new com.example.demo.dto.FleetOverviewResponse.CarStatusData(
                            car.getCarId(),
                            car.getCarName(),
                            car.getCarType() != null ? car.getCarType().getCarTypeName() : "Unknown",
                            car.getNumberPlate(),
                            status,
                            car.getCarType() != null ? car.getCarType().getDailyRate() : null,
                            car.getImagePath(),
                            rentalInfo));
                }

                int total = carStatusList.size();
                int available = (int) carStatusList.stream().filter(c -> "Available".equals(c.getStatus())).count();
                int rented = (int) carStatusList.stream().filter(c -> "Rented".equals(c.getStatus())).count();
                int maintenance = (int) carStatusList.stream().filter(c -> "Maintenance".equals(c.getStatus())).count();

                hubFleetDataList.add(new com.example.demo.dto.FleetOverviewResponse.HubFleetData(
                        hub.getHubId(),
                        hub.getHubName(),
                        hub.getCity() != null ? hub.getCity().getCityName() : "Unknown",
                        carStatusList,
                        total,
                        available,
                        rented,
                        maintenance));
            }

            int totalCars = cars.size();
            int totalAvailable = hubFleetDataList.stream()
                    .mapToInt(com.example.demo.dto.FleetOverviewResponse.HubFleetData::getAvailableCars).sum();
            int totalRented = hubFleetDataList.stream()
                    .mapToInt(com.example.demo.dto.FleetOverviewResponse.HubFleetData::getRentedCars).sum();
            int totalMaintenance = hubFleetDataList.stream()
                    .mapToInt(com.example.demo.dto.FleetOverviewResponse.HubFleetData::getMaintenanceCars).sum();
            double utilizationRate = totalCars > 0 ? (double) totalRented / totalCars * 100 : 0;

            com.example.demo.dto.FleetOverviewResponse response = new com.example.demo.dto.FleetOverviewResponse();
            response.setHubs(hubFleetDataList);
            response.setStatistics(new com.example.demo.dto.FleetOverviewResponse.FleetStatistics(
                    totalCars,
                    totalAvailable,
                    totalRented,
                    totalMaintenance,
                    Math.round(utilizationRate * 100.0) / 100.0));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/register-staff")
    public ResponseEntity<?> registerStaff(@RequestBody com.example.demo.Entity.User user) {
        try {
            user.setRole(com.example.demo.Entity.Role.STAFF);
            // Use the service to add user which handles password encoding
            userService.addUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Staff registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to register staff: " + e.getMessage()));
        }
    }

    @GetMapping("/staff")
    public ResponseEntity<List<com.example.demo.Entity.User>> getAllStaff() {
        return ResponseEntity.ok(userRepository.findByRole(com.example.demo.Entity.Role.STAFF));
    }

    @GetMapping("/hubs")
    public ResponseEntity<List<com.example.demo.Entity.HubMaster>> getAllHubs() {
        return ResponseEntity.ok(hubRepository.findAll());
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable int id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Staff removed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Failed to remove staff"));
        }
    }

}
