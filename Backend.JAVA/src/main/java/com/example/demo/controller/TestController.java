package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class TestController {

	@org.springframework.beans.factory.annotation.Autowired
	private com.example.demo.Repository.StateRepository stateRepository;
	@org.springframework.beans.factory.annotation.Autowired
	private com.example.demo.Repository.CityRepository cityRepository;
	@org.springframework.beans.factory.annotation.Autowired
	private com.example.demo.Repository.HubRepository hubRepository;
	@org.springframework.beans.factory.annotation.Autowired
	private com.example.demo.Repository.CarTypeMasterRepository carTypeMasterRepository;
	@org.springframework.beans.factory.annotation.Autowired
	private com.example.demo.Repository.CarRepository carRepository;

	@GetMapping("/home")
	public String HomePage(HttpServletRequest request) {
		return "Home " + request.getSession().getId();
	}

	@GetMapping("/about")
	public String Page(HttpServletRequest request) {
		return "about" + request.getSession().getId();
	}

	@GetMapping("/test/seed")
	public String seedData() {
		try {
			// 1. State
			com.example.demo.Entity.StateMaster state = stateRepository.findAll().stream().findFirst().orElse(null);
			if (state == null) {
				state = new com.example.demo.Entity.StateMaster();
				state.setStateName("Maharashtra");
				state = stateRepository.save(state);
			}

			// 2. City
			com.example.demo.Entity.CityMaster city = cityRepository.findAll().stream().findFirst().orElse(null);
			if (city == null) {
				city = new com.example.demo.Entity.CityMaster();
				city.setCityName("Mumbai");
				city.setState(state);
				city = cityRepository.save(city);
			}

			// 3. Hub
			com.example.demo.Entity.HubMaster hub = hubRepository.findAll().stream().findFirst().orElse(null);
			if (hub == null) {
				hub = new com.example.demo.Entity.HubMaster();
				hub.setHubName("Mumbai Airport Hub");
				hub.setHubAddressAndDetails("Terminal 2, Mumbai International Airport");
				hub.setContactNumber(9876543210L);
				hub.setCity(city);
				hub.setState(state);
				hub = hubRepository.save(hub);
			}

			// 4. Car Type
			com.example.demo.Entity.CarTypeMaster carType = carTypeMasterRepository.findAll().stream().findFirst()
					.orElse(null);
			if (carType == null) {
				carType = new com.example.demo.Entity.CarTypeMaster();
				carType.setCarTypeName("SUV");
				carType.setDailyRate(5000.0);
				carType.setWeeklyRate(30000.0);
				carType.setMonthlyRate(100000.0);
				carType.setImagePath("https://example.com/suv.jpg");
				carType = carTypeMasterRepository.save(carType);
			}

			// 5. Car
			if (carRepository.count() == 0) {
				com.example.demo.Entity.CarMaster car = new com.example.demo.Entity.CarMaster();
				car.setCarName("Toyota Fortuner");
				car.setNumberPlate("MH01AB1234");
				car.setStatus("Active");
				car.setMileage(10.5);
				car.setHub(hub);
				car.setCarType(carType);
				car.setIsAvailable(com.example.demo.Entity.CarMaster.AvailabilityStatus.Y);
				car.setMaintenanceDueDate(new java.sql.Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000));
				carRepository.save(car);
			}

			return "Data Seeded Successfully!";
		} catch (Exception e) {
			e.printStackTrace();
			return "Seeding Failed: " + e.getMessage();
		}
	}
}
