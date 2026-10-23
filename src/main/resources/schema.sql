-- ==============================================================================
-- JAN-SURAKSHA: CITIZEN GRIEVANCE MANAGEMENT SYSTEM (CGMS)
-- Relational SQL Database Schema (DDL)
-- Compatible with MySQL, PostgreSQL, H2, and SQLite
-- ==============================================================================

-- 1. Users Table (Citizen, Ward Member, President, Administrator)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128),
    role VARCHAR(64) NOT NULL,
    avatar VARCHAR(512),
    user_type VARCHAR(32) NOT NULL,
    ward_id VARCHAR(32),
    ward_name VARCHAR(128),
    assigned_ward_id VARCHAR(32),
    assigned_ward_name VARCHAR(128),
    panchayath_name VARCHAR(128),
    system_console VARCHAR(128)
);

-- 2. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    ward_id VARCHAR(32),
    ward_name VARCHAR(128),
    citizen_id VARCHAR(64),
    citizen_name VARCHAR(128),
    citizen_email VARCHAR(128),
    urgency VARCHAR(20) NOT NULL,
    status VARCHAR(32) NOT NULL,
    upvotes INT DEFAULT 1,
    assigned_department VARCHAR(128) DEFAULT 'Unassigned',
    ward_remarks TEXT,
    photo_url CLOB,
    created_at VARCHAR(32),
    is_merged BOOLEAN DEFAULT FALSE,
    master_complaint_id VARCHAR(32),
    priority_score DOUBLE DEFAULT 0.0
);

-- 3. Complaint Children Table (for Merged/Duplicate Relations)
CREATE TABLE IF NOT EXISTS complaint_children (
    complaint_id VARCHAR(32) NOT NULL,
    child_id VARCHAR(32) NOT NULL,
    PRIMARY KEY (complaint_id, child_id),
    CONSTRAINT fk_complaint_parent FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    complaint_id VARCHAR(32),
    message TEXT,
    type VARCHAR(32),
    time_str VARCHAR(32)
);

-- Indexes for Fast Query Optimization
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_ward ON complaints(ward_id);
