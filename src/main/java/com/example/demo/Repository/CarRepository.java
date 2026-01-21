package com.example.demo.Repository;

import com.example.demo.Entity.CarMaster;
import com.example.demo.Entity.CarMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<CarMaster, Integer> {

    @Query(value = "SELECT car.car_name, car.is_available, hub.hub_name, hub.hub_address_and_details, \n" +
            "       car_type.cartype_name, car_type.daily_rate, car_type.monthly_rate, car_type.weekly_rate \n" +
            "FROM car_master car \n" +
            "LEFT JOIN hub_master hub ON car.hub_id = hub.hub_id \n" +
            "LEFT JOIN car_type_master car_type ON car.cartype_id = car_type.cartype_id \n" +
            "WHERE hub.hub_address_and_details = :hubAddress", nativeQuery = true)

    List<Object[]> findCarDetailsByHubAddress(String hubAddress);

}
