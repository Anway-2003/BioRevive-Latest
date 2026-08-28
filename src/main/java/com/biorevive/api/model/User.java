package com.biorevive.api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "profiles") 
public class User {

    @Id
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "id", columnDefinition = "uuid", updatable = false, nullable = false)
    private String id; 

    @Column(name = "full_name")
    private String fullName;

    private String email;

    private String role; // Individual, NGO and Organization

    private Integer points;

    // Default Constructor 
    public User() {
    }

    // Parameterized Constructor
    public User(String id, String fullName, String email, String role, Integer points) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.points = points;
    }

    // --- Getters and Setters ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }
}