package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.demo.Entity.CustomerMaster;
import com.example.demo.Service.CustomerService;
import com.example.demo.dto.ApiResponse;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
// @RequestMapping("api/v1") // Removing class level to avoid conflict with
// existing root paths, adding manually
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private RestTemplate restTemplate;

    // API v1 Endpoints
    @org.springframework.web.bind.annotation.GetMapping("/api/v1/customers")
    public ResponseEntity<java.util.List<CustomerMaster>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @org.springframework.web.bind.annotation.GetMapping("/api/v1/customers/{email}")
    public ResponseEntity<CustomerMaster> getCustomerByEmail(
            @org.springframework.web.bind.annotation.PathVariable String email) {
        CustomerMaster customer = customerService.findByEmail(email);
        return ResponseEntity.ok(customer); // Return 200 with null body if not found, or 404? Frontend handles
                                            // nulls/errors.
    }

    @PostMapping("/api/v1/customers")
    public ResponseEntity<ApiResponse> saveCustomerApiV1(@RequestBody CustomerMaster customer) {
        return saveOrUpdateCustomer(customer);
    }

    @PostMapping("/addCustomer")
    public ResponseEntity<ApiResponse> addCustomer(@RequestBody CustomerMaster customer) {
        CustomerMaster customerMaster = customerService.AddCustomer(customer);

        // Call Email microservice
        String emailServiceUrl = "http://localhost:8081/sendEmail";
        Map<String, Object> emailMaster = new HashMap<>();
        emailMaster.put("name", customerMaster.getFirstName() + " " + customerMaster.getLastName());
        emailMaster.put("email", customerMaster.getEmail());

        try {
            restTemplate.postForObject(emailServiceUrl, emailMaster, String.class);

        } catch (Exception e) {
            System.err.println("An error occurred while sending the email: " + e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Customer added successfully", true, null));

    }

    @org.springframework.web.bind.annotation.GetMapping("/find")
    public ResponseEntity<CustomerMaster> findCustomer(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String email,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String membershipId) {

        CustomerMaster customer = null;
        if (email != null && !email.isEmpty()) {
            customer = customerService.findByEmail(email);
        } else if (membershipId != null && !membershipId.isEmpty()) {
            customer = customerService.findByMembershipId(membershipId);
        }

        if (customer != null) {
            return ResponseEntity.ok(customer);
        } else {
            return ResponseEntity.ok(null);
        }
    }

    @PostMapping("/customer/save-or-update")
    public ResponseEntity<ApiResponse> saveOrUpdateCustomer(@RequestBody CustomerMaster customer) {
        System.out.println("Received Customer Update: " + customer);
        if (customer.getEmail() == null || customer.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Email is required", false, null));
        }

        try {
            CustomerMaster saved = customerService.saveOrUpdateCustomer(customer);
            return ResponseEntity.ok(new ApiResponse("Customer information saved", true, saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error saving customer: " + e.getMessage(), false, null));
        }
    }

    @org.springframework.web.bind.annotation.GetMapping("/api/v1/customers/id/{id}")
    public ResponseEntity<CustomerMaster> getCustomerById(
            @org.springframework.web.bind.annotation.PathVariable Integer id) {
        CustomerMaster customer = customerService.findById(id);
        if (customer != null) {
            return ResponseEntity.ok(customer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Placeholder for PUT
    @org.springframework.web.bind.annotation.PutMapping("/api/v1/customers/{id}")
    public ResponseEntity<CustomerMaster> updateCustomer(
            @org.springframework.web.bind.annotation.PathVariable Integer id, @RequestBody CustomerMaster customer) {
        customer.setCustId(id);
        CustomerMaster saved = customerService.saveOrUpdateCustomer(customer);
        return ResponseEntity.ok(saved);
    }

}
