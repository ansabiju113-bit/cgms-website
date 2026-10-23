# Jan-Suraksha: SQL Relational Database Architecture

This application uses a relational **SQL Database (Spring Data JPA / Hibernate ORM)** with full relational schema modeling, JPA repositories, and SQL queries.

---

## 1. Database Architecture & Relational Tables

### 1. `complaints` Table
| Column Name | SQL Type | Description |
|---|---|---|
| `id` | `VARCHAR(32)` | **PRIMARY KEY** (e.g. `CMP-1001`) |
| `title` | `VARCHAR(255)` | Grievance title |
| `category` | `VARCHAR(64)` | Category (Road Damage, Streetlight, Water Supply, etc.) |
| `description` | `TEXT` | Detailed grievance description |
| `location` | `VARCHAR(255)` | Geographic landmark/street |
| `latitude` | `DOUBLE` | Latitude coordinates |
| `longitude` | `DOUBLE` | Longitude coordinates |
| `ward_id` | `VARCHAR(32)` | Ward identifier (`W1`, `W2`, etc.) |
| `ward_name` | `VARCHAR(128)` | Full Ward name |
| `citizen_id` | `VARCHAR(64)` | Filing citizen UID |
| `citizen_name` | `VARCHAR(128)` | Filing citizen name |
| `citizen_email` | `VARCHAR(128)` | Filing citizen email |
| `urgency` | `VARCHAR(20)` | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `status` | `VARCHAR(32)` | `SUBMITTED`, `APPROVED`, `IN_PROGRESS`, `RESOLVED`, `REJECTED` |
| `upvotes` | `INT` | Community votes count |
| `assigned_department` | `VARCHAR(128)` | Assigned department (PWD, Water, Electrical, Sanitation) |
| `ward_remarks` | `TEXT` | Administrative/Field verification remarks |
| `photo_url` | `CLOB/LONGTEXT` | Attached proof photo (compressed data URL or CDN link) |
| `created_at` | `VARCHAR(32)` | Submission timestamp |
| `is_merged` | `BOOLEAN` | Merged flag |
| `master_complaint_id`| `VARCHAR(32)` | Master ticket reference |
| `priority_score` | `DOUBLE` | Dynamically calculated algorithmic score |

### 2. `users` Table (Single-Table Inheritance)
| Column Name | SQL Type | Description |
|---|---|---|
| `id` | `VARCHAR(64)` | **PRIMARY KEY** (`U101`, `U201`, etc.) |
| `name` | `VARCHAR(128)` | User's full name |
| `email` | `VARCHAR(128)` | User's email |
| `role` | `VARCHAR(64)` | User role (`Citizen`, `Ward Member`, `President`, `Admin`) |
| `user_type` | `VARCHAR(32)` | Discriminator column (`CITIZEN`, `WARD_MEMBER`, `PRESIDENT`, `ADMIN`) |
| `ward_id` / `ward_name` | `VARCHAR` | Assigned ward details |
| `avatar` | `VARCHAR(512)` | Profile picture URL |

### 3. `complaint_children` Table
Foreign key relation for AI-merged duplicate tickets linked to master complaint tickets.

### 4. `notifications` Table
Stores real-time system alerts for citizens and municipal administrators.

---

## 2. Interactive Web SQL Console (H2)

When running the application with:
```bash
mvn clean spring-boot:run
```

You can open the live **Web SQL Console** in your browser at:
* **URL:** `http://localhost:8080/h2-console`
* **JDBC URL:** `jdbc:h2:mem:cgmsdb`
* **Username:** `sa`
* **Password:** `password`

### Sample SQL Queries to Test in the Console:

```sql
-- 1. View all active complaints grouped by Category
SELECT category, COUNT(*) AS total_grievances, SUM(upvotes) AS total_votes
FROM complaints
WHERE is_merged = FALSE
GROUP BY category
ORDER BY total_votes DESC;

-- 2. View highest priority complaints requiring immediate municipal action
SELECT id, title, category, urgency, upvotes, priority_score, status
FROM complaints
ORDER BY priority_score DESC;

-- 3. Filter complaints by Ward
SELECT id, title, citizen_name, location, status
FROM complaints
WHERE ward_id = 'W1';
```

---

## 3. Switching to MySQL (Optional)

To connect to a live MySQL database, open `src/main/resources/application.properties` and configure:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cgms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```
Hibernate will automatically create the schema in MySQL!
