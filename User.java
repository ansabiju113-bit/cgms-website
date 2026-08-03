package com.jansuraksha.model;

import java.time.LocalDateTime;

/**
 * Abstract Base Class representing a System User in Jan-Suraksha.
 * Implements Encapsulation and Polymorphism principles.
 */
public abstract class User {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String role; // CITIZEN, WARD_MEMBER, PRESIDENT, ADMIN
    private LocalDateTime createdAt;

    public User(String id, String name, String email, String phone, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }

    // Abstract method to be overridden by subclasses (Polymorphism)
    public abstract String getDashboardAccessLevel();

    // Getters and Setters (Encapsulation)
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }

    @Override
    public String toString() {
        return String.format("%s [ID: %s, Name: %s, Role: %s]", getClass().getSimpleName(), id, name, role);
    }
}
