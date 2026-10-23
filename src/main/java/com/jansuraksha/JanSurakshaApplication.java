package com.jansuraksha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * JAN-SURAKSHA: CITIZEN GRIEVANCE MANAGEMENT SYSTEM (CGMS)
 * Core Spring Boot Application Entrypoint
 */
@SpringBootApplication
public class JanSurakshaApplication {

    public static void main(String[] args) {
        SpringApplication.run(JanSurakshaApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  JAN-SURAKSHA (CGMS) Java Spring Boot Server Running");
        System.out.println("  Web Interface: http://localhost:8080/");
        System.out.println("  API Endpoints: http://localhost:8080/api/complaints");
        System.out.println("  Grouped API:   http://localhost:8080/api/complaints/grouped");
        System.out.println("==================================================================");
    }
}
