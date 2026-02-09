package com.example.demo.Service;

import com.example.demo.Entity.CustomerMaster;

import java.util.List;

public interface CustomerService {
    List<CustomerMaster> getAllCustomers();

    CustomerMaster AddCustomer(CustomerMaster customer);

    CustomerMaster findByEmail(String email);

    CustomerMaster findByMembershipId(String membershipId);

    CustomerMaster findById(Integer id);

    CustomerMaster saveOrUpdateCustomer(CustomerMaster customer);
}
