package com.example.demo.Entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "invoice_header_table")
@Data
public class InvoiceHeaderTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private long invoiceId;

    @Column(name = "date")
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private BookingHeaderTable booking;

    @ManyToOne
    @JoinColumn(name = "cust_id")
    private CustomerMaster customer;

    @Column(name = "handover_date")
    private LocalDate handoverDate;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private CarMaster car;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "rental_amt")
    private double rentalAmt;

    @Column(name = "total_addon_amt")
    private double totalAddonAmt;

    @Column(name = "total_amt")
    private double totalAmt;

    @Column(name = "customer_details")
    private String customerDetails;

    @Column(name = "rate")
    private String rate;

    // Manual Getters and Setters

    public long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BookingHeaderTable getBooking() {
        return booking;
    }

    public void setBooking(BookingHeaderTable booking) {
        this.booking = booking;
    }

    public CustomerMaster getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerMaster customer) {
        this.customer = customer;
    }

    public LocalDate getHandoverDate() {
        return handoverDate;
    }

    public void setHandoverDate(LocalDate handoverDate) {
        this.handoverDate = handoverDate;
    }

    public CarMaster getCar() {
        return car;
    }

    public void setCar(CarMaster car) {
        this.car = car;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public double getRentalAmt() {
        return rentalAmt;
    }

    public void setRentalAmt(double rentalAmt) {
        this.rentalAmt = rentalAmt;
    }

    public double getTotalAddonAmt() {
        return totalAddonAmt;
    }

    public void setTotalAddonAmt(double totalAddonAmt) {
        this.totalAddonAmt = totalAddonAmt;
    }

    public double getTotalAmt() {
        return totalAmt;
    }

    public void setTotalAmt(double totalAmt) {
        this.totalAmt = totalAmt;
    }

    public String getCustomerDetails() {
        return customerDetails;
    }

    public void setCustomerDetails(String customerDetails) {
        this.customerDetails = customerDetails;
    }

    public String getRate() {
        return rate;
    }

    public void setRate(String rate) {
        this.rate = rate;
    }

}
