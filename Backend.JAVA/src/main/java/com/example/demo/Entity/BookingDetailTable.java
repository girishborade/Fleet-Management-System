package com.example.demo.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "booking_detail_table")
@Data
public class BookingDetailTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_detail_id")
    private long bookingDetailId;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private BookingHeaderTable booking;

    @ManyToOne
    @JoinColumn(name = "addon_id")
    private AddOnMaster addon;

    @Column(name = "addon_rate")
    private double addonRate;

    public long getBookingDetailId() {
        return bookingDetailId;
    }

    public void setBookingDetailId(long bookingDetailId) {
        this.bookingDetailId = bookingDetailId;
    }

    public BookingHeaderTable getBooking() {
        return booking;
    }

    public void setBooking(BookingHeaderTable booking) {
        this.booking = booking;
    }

    public AddOnMaster getAddon() {
        return addon;
    }

    public void setAddon(AddOnMaster addon) {
        this.addon = addon;
    }

    public double getAddonRate() {
        return addonRate;
    }

    public void setAddonRate(double addonRate) {
        this.addonRate = addonRate;
    }

}
