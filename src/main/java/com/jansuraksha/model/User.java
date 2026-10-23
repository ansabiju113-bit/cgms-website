package com.jansuraksha.model;

import jakarta.persistence.*;

/**
 * SQL Relational Entity mapped to 'users' table using Single-Table Inheritance.
 */
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
public abstract class User {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "email", length = 128)
    private String email;

    @Column(name = "role", nullable = false, length = 64)
    private String role;

    @Column(name = "avatar", length = 512)
    private String avatar;

    public User() {}

    public User(String id, String name, String email, String role, String avatar) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.avatar = avatar;
    }

    public abstract String getDashboardAccessLevel();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
}
