package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.CustomerMaster;
import com.example.demo.Repository.CustomerRepository;

@Service
public class CustomerServiceIml implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;


    @Override
    public CustomerMaster AddCustomer(CustomerMaster customer) {
        CustomerMaster customerMaster = customerRepository.save(customer);
        return customerMaster;
    }

}
