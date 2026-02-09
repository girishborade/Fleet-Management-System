package com.example.demo.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "user")
@Data
public class User {
	public User() {
		super();
	}

	public User(int id, String username, String password, String email) {
		super();
		Id = id;
		this.username = username;
		this.password = password;
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id;

	@Column(unique = true)
	private String username;

	@Column(unique = true)
	private String password;

	@Column(unique = true)
	private String email;

	@jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
	@Column(name = "role")
	private Role role;

	@ManyToOne
	@jakarta.persistence.JoinColumn(name = "hub_id")
	private HubMaster hub;

	@Column(name = "reset_token")
	private String resetToken;

	@Column(name = "reset_token_expiry")
	private LocalDateTime resetTokenExpiry;

	// Manual Getters and Setters

	public int getId() {
		return Id;
	}

	public void setId(int id) {
		Id = id;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public HubMaster getHub() {
		return hub;
	}

	public void setHub(HubMaster hub) {
		this.hub = hub;
	}

	public String getResetToken() {
		return resetToken;
	}

	public void setResetToken(String resetToken) {
		this.resetToken = resetToken;
	}

	public LocalDateTime getResetTokenExpiry() {
		return resetTokenExpiry;
	}

	public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
		this.resetTokenExpiry = resetTokenExpiry;
	}
}
