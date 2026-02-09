package com.example.demo.Repository;

import com.example.demo.Entity.BookingHeaderTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingHeaderTable, Long> {
    Optional<BookingHeaderTable> findByConfirmationNumber(String confirmationNumber);

    List<BookingHeaderTable> findByEmailId(String emailId);

    List<BookingHeaderTable> findByPickupHub_HubId(Integer hubId);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM BookingHeaderTable b WHERE " +
            "(b.bookingStatus = 'ACTIVE' OR b.bookingStatus = 'CONFIRMED') AND " +
            "b.startDate <= :endDate AND b.endDate >= :startDate")
    List<BookingHeaderTable> findBookingsByDateRange(
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate,
            @org.springframework.data.repository.query.Param("endDate") java.time.LocalDate endDate);

    List<BookingHeaderTable> findByBookingStatus(String bookingStatus);
}
