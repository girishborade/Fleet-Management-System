package com.example.demo.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;



//@AllArgsConstructor
public class ApiResponse {
    
    private String message;
    private LocalDateTime timestamp;
    public ApiResponse(String message, LocalDateTime timestamp) {
		// TODO Auto-generated constructor stub
    	this.message = message;
    	this.timestamp = timestamp;
	}
	public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
