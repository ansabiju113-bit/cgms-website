# JAN-SURAKSHA: Spring Boot Java Web Application (v2.4)

## Architecture Overview
This application has been converted to an enterprise-grade **Java Spring Boot (Java 17+)** web application with full Object-Oriented Design (OOP):

- **Model Hierarchy:**
  - `User.java` (Abstract Base Class)
  - `Citizen.java`, `WardMember.java`, `PanchayathPresident.java`, `Admin.java` (Polymorphic Role Implementations)
  - `Complaint.java` (Encapsulated Entity with Priority Scoring)
- **Strategy Pattern:**
  - `PriorityCalculationStrategy.java` & `StandardPriorityStrategy.java`
- **AI Engine Service:**
  - `AIMergingEngine.java` (Jaccard similarity calculation & Haversine distance tracking)
- **RESTful Controllers:**
  - `ComplaintController.java` (`/api/complaints`, `/api/complaints/grouped`, `/api/complaints/{id}/upvote`, `/api/complaints/{id}/status`)
  - `AdminController.java` (`/api/admin/verify`, `/api/admin/stats`, `/api/admin/ai/duplicates`, `/api/admin/ai/merge`)
- **Integrated Web Interface:**
  - Embedded inside `src/main/resources/static/` served directly by Spring Boot on `http://localhost:8080/`.

## How to Build and Run
1. Install JDK 17 or later.
2. In the project root, execute:
   ```bash
   mvn clean spring-boot:run
   ```
   Or package into a standalone executable JAR:
   ```bash
   mvn clean package
   java -jar target/cgms-website-2.4.0.jar
   ```
3. Open your browser to:
   - **Web UI:** `http://localhost:8080/`
   - **REST API:** `http://localhost:8080/api/complaints`
   - **Grouped Categories API:** `http://localhost:8080/api/complaints/grouped`
