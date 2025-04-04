
CREATE DATABASE IF NOT EXISTS Policee_dashboard;
USE Policee_dashboard;


SET GLOBAL event_scheduler = ON;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'dispatcher', 'patrol_officer', 'armory_officer', 'front_desk_officer', 'temporary_cells_manager', 'surveillance_officer') NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    active BOOLEAN DEFAULT TRUE
);


CREATE TABLE IF NOT EXISTS citizens (
    citizen_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    phone_number VARCHAR(20),
    driver_license VARCHAR(20),
    license_expiry DATE,
    vehicle_make VARCHAR(50),
    vehicle_model VARCHAR(50),
    vehicle_color VARCHAR(50),
    vehicle_plate VARCHAR(20),
    criminal_record BOOLEAN DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS weapons (
    weapon_id INT AUTO_INCREMENT PRIMARY KEY,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('pistol', 'rifle', 'shotgun', 'taser') NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    purchase_date DATE,
    assigned_to INT,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(50),
    plate_number VARCHAR(20) UNIQUE,
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES citizens(citizen_id)
);

 
CREATE TABLE IF NOT EXISTS cases (
    case_id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
    assigned_officer INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    FOREIGN KEY (assigned_officer) REFERENCES users(user_id)
);

 
CREATE TABLE IF NOT EXISTS officer_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    rank VARCHAR(50),
    duty_status ENUM('on_duty', 'off_duty') DEFAULT 'off_duty',
    health_status VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

 
CREATE TABLE IF NOT EXISTS dispatch_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    officer_id INT,
    dispatched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (case_id) REFERENCES cases(case_id),
    FOREIGN KEY (officer_id) REFERENCES users(user_id)
);

 
CREATE TABLE IF NOT EXISTS inventory (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    category ENUM('weapon', 'equipment', 'vehicle'),
    condition ENUM('new', 'used', 'damaged'),
    quantity INT,
    assigned_to INT,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

 
CREATE TABLE IF NOT EXISTS cctv_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    camera_location VARCHAR(100),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_description TEXT
);

 
CREATE TABLE IF NOT EXISTS reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    content TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);
 
CREATE TABLE IF NOT EXISTS patrol_units (
    unit_id INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(50),
    officers_assigned TEXT
);

 
CREATE TABLE IF NOT EXISTS health_monitoring (
    monitor_id INT AUTO_INCREMENT PRIMARY KEY,
    officer_id INT,
    heart_rate INT,
    activity_level ENUM('low', 'medium', 'high'),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (officer_id) REFERENCES users(user_id)
);

 
CREATE TABLE IF NOT EXISTS error_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    error_message TEXT,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 

CREATE TABLE IF NOT EXISTS emergency_calls (
    call_id INT AUTO_INCREMENT PRIMARY KEY,
    caller_name VARCHAR(100),
    caller_phone VARCHAR(20),
    location TEXT,
    description TEXT,
    status ENUM('received', 'dispatched', 'resolved', 'canceled') DEFAULT 'received',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    assigned_unit INT,
    FOREIGN KEY (assigned_unit) REFERENCES patrol_units(unit_id) ON DELETE SET NULL
);
 
CREATE TABLE IF NOT EXISTS daily_statistics (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    total_cases_opened INT DEFAULT 0,
    total_cases_closed INT DEFAULT 0,
    total_emergency_calls INT DEFAULT 0,
    total_officers_on_duty INT DEFAULT 0,
    total_pending_reports INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
 
DELIMITER //
CREATE PROCEDURE UpdateDailyStatistics()
BEGIN
    INSERT INTO daily_statistics (
        date, 
        total_cases_opened, 
        total_cases_closed, 
        total_emergency_calls, 
        total_officers_on_duty,
        total_pending_reports
    ) VALUES (
        CURRENT_DATE,
        (SELECT COUNT(*) FROM cases WHERE created_at >= CURRENT_DATE),
        (SELECT COUNT(*) FROM cases WHERE status = 'closed' AND closed_at >= CURRENT_DATE),
        (SELECT COUNT(*) FROM emergency_calls WHERE received_at >= CURRENT_DATE),
        (SELECT COUNT(*) FROM officer_profiles WHERE duty_status = 'on_duty'),
        (SELECT COUNT(*) FROM reports WHERE created_at >= CURRENT_DATE)
    ) ON DUPLICATE KEY UPDATE 
        total_cases_opened = VALUES(total_cases_opened),
        total_cases_closed = VALUES(total_cases_closed),
        total_emergency_calls = VALUES(total_emergency_calls),
        total_officers_on_duty = VALUES(total_officers_on_duty),
        total_pending_reports = VALUES(total_pending_reports);
END //
DELIMITER ;

 
DELIMITER //
CREATE TRIGGER update_officer_duty_status 
BEFORE INSERT ON dispatch_assignments
FOR EACH ROW
BEGIN
    UPDATE officer_profiles 
    SET duty_status = 'on_duty' 
    WHERE user_id = NEW.officer_id;
END //
DELIMITER ;
 
CREATE VIEW dashboard_statistics AS 
SELECT 
    (SELECT COUNT(*) FROM cases WHERE status != 'closed') AS open_cases,
    (SELECT COUNT(*) FROM officer_profiles WHERE duty_status = 'on_duty') AS officers_on_duty,
    (SELECT COUNT(*) FROM emergency_calls WHERE status != 'resolved') AS pending_emergency_calls,
    (SELECT COUNT(*) FROM reports WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)) AS pending_reports;

 
CREATE EVENT IF NOT EXISTS daily_stats_update
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    CALL UpdateDailyStatistics();

 
DELIMITER //
CREATE PROCEDURE InsertSampleData()
BEGIN
  
    INSERT INTO users (username, password_hash, role, first_name, last_name, email, phone_number, active)
    VALUES
    ('john_doe', 'hashed_password_1', 'patrol_officer', 'John', 'Doe', 'john.doe@example.com', '1234567890', TRUE),
    ('jane_smith', 'hashed_password_2', 'dispatcher', 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', TRUE),
    ('admin_user', 'hashed_password_3', 'admin', 'Admin', 'User', 'admin@example.com', '1112223333', TRUE);

    -- Insert sample citizens
    INSERT INTO citizens (name, date_of_birth, gender, address, phone_number, driver_license, license_expiry, vehicle_make, vehicle_model, vehicle_color, vehicle_plate, criminal_record)
    VALUES
    ('Alice Johnson', '1985-05-15', 'female', '123 Main St, City', '5551234567', 'DL123456', '2025-05-15', 'Toyota', 'Camry', 'Blue', 'ABC123', FALSE),
    ('Bob Smith', '1970-08-22', 'male', '456 Elm St, Town', '5559876543', 'DL789012', '2024-08-22', 'Honda', 'Civic', 'Red', 'XYZ789', TRUE);

    -- Insert sample weapons
    INSERT INTO weapons (serial_number, type, brand, model, purchase_date, assigned_to)
    VALUES
    ('WPN12345', 'pistol', 'Glock', 'G17', '2020-01-01', 1),
    ('WPN67890', 'rifle', 'Remington', '700', '2019-06-15', 2);

    -- Insert sample vehicles
    INSERT INTO vehicles (make, model, color, plate_number, owner_id)
    VALUES
    ('Toyota', 'Camry', 'Blue', 'ABC123', 1),
    ('Honda', 'Civic', 'Red', 'XYZ789', 2);

    -- Insert sample cases
    INSERT INTO cases (description, status, assigned_officer)
    VALUES
    ('Robbery Investigation', 'open', 1),
    ('Missing Person', 'in_progress', 2);

    -- Insert sample officer profiles
    INSERT INTO officer_profiles (user_id, rank, duty_status, health_status)
    VALUES
    (1, 'Sergeant', 'on_duty', 'Good'),
    (2, 'Lieutenant', 'on_duty', 'Excellent');

    -- Insert sample dispatch assignments
    INSERT INTO dispatch_assignments (case_id, officer_id)
    VALUES
    (1, 1),
    (2, 2);

   
    INSERT INTO inventory (name, category, condition, quantity, assigned_to)
    VALUES
    ('Tactical Vest', 'equipment', 'new', 10, 1),
    ('Night Vision Goggles', 'equipment', 'used', 5, 2);
 
    INSERT INTO cctv_logs (camera_location, event_description)
    VALUES
    ('Main Entrance', 'Suspicious individual loitering'),
    ('Parking Lot', 'Vehicle break-in attempt');

  
    INSERT INTO reports (title, content, created_by)
    VALUES
    ('Daily Patrol Report', 'Routine patrol conducted in downtown area.', 1),
    ('Incident Report', 'Responded to noise complaint at residential zone.', 2);

 
    INSERT INTO patrol_units (unit_name, officers_assigned)
    VALUES
    ('Unit A', 'John Doe, Jane Smith'),
    ('Unit B', 'Alice Johnson');

  
    INSERT INTO health_monitoring (officer_id, heart_rate, activity_level)
    VALUES
    (1, 72, 'medium'),
    (2, 68, 'low');

  
    INSERT INTO error_logs (error_message)
    VALUES
    ('Database connection timeout.'),
    ('Failed to fetch CCTV logs.');

 
    INSERT INTO emergency_calls (caller_name, caller_phone, location, description, status, priority)
    VALUES
    ('Anonymous', '911', 'Downtown Area', 'Suspicious Activity', 'received', 'high'),
    ('Citizen', '112', 'Residential Zone', 'Noise Complaint', 'dispatched', 'medium');

    
    INSERT INTO daily_statistics (date, total_cases_opened, total_cases_closed, total_emergency_calls, total_officers_on_duty, total_pending_reports)
    VALUES
    (CURDATE(), 2, 1, 3, 2, 1);
END //
DELIMITER ;

 
CALL InsertSampleData();

CREATE TABLE active_calls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE suspects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL
);
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(50) NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL
);
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL
);
INSERT INTO active_calls (case_number, type, location, status)
VALUES 
('CR-2024-001', 'Robbery', '123 Main St', 'In Progress'),
('CR-2024-002', 'Assault', '456 Elm St', 'Pending');
INSERT INTO suspects (name, dob, address, status)
VALUES 
('John Doe', '1985-03-15', '123 Main St, Anytown, USA', 'No Active Warrants'),
('Jane Smith', '1990-07-22', '456 Oak Ave, Somecity, USA', 'Pending Investigation');
INSERT INTO vehicles (plate_number, make, model, color, status)
VALUES 
('ABC-123', 'Ford', 'F-150', 'White', 'Registered'),
('XYZ-789', 'Toyota', 'Camry', 'Red', 'Stolen');

INSERT INTO reports (case_number, type, date, status)
VALUES 
('CR-2024-0572', 'Theft', '2024-03-15', 'Under Investigation'),
('CR-2024-0573', 'Vandalism', '2024-03-16', 'Closed');

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE active_calls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suspects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL
);

CREATE TABLE suspects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL
);

CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(50) NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE weapons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial_number VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- Ensure the database exists
CREATE DATABASE IF NOT EXISTS Policee_dashboard;
USE Policee_dashboard;

-- Enable the event scheduler
SET GLOBAL event_scheduler = ON;

-- Table: users (Users Table)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'dispatcher', 'patrol_officer', 'armory_officer', 'front_desk_officer', 'temporary_cells_manager', 'surveillance_officer') NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    active BOOLEAN DEFAULT TRUE
);

-- Insert Admin User
INSERT INTO users (username, password_hash, role, first_name, last_name, email, phone_number, active)
VALUES ('taha', 'taha23', 'admin', 'Taha', 'Admin', 'taha@example.com', '1234567890', TRUE);

-- Insert Dispatcher User
INSERT INTO users (username, password_hash, role, first_name, last_name, email, phone_number, active)
VALUES ('mehmet', 'mehmet23', 'dispatcher', 'Mehmet', 'Dispatcher', 'mehmet@example.com', '0987654321', TRUE);

-- Insert Five Patrol Officers
INSERT INTO users (username, password_hash, role, first_name, last_name, email, phone_number, active)
VALUES 
('officer1', 'officer1_pass', 'patrol_officer', 'John', 'Doe', 'john.doe@example.com', '1111111111', TRUE),
('officer2', 'officer2_pass', 'patrol_officer', 'Jane', 'Smith', 'jane.smith@example.com', '2222222222', TRUE),
('officer3', 'officer3_pass', 'patrol_officer', 'Alice', 'Johnson', 'alice.johnson@example.com', '3333333333', TRUE),
('officer4', 'officer4_pass', 'patrol_officer', 'Bob', 'Brown', 'bob.brown@example.com', '4444444444', TRUE),
('officer5', 'officer5_pass', 'patrol_officer', 'Charlie', 'Davis', 'charlie.davis@example.com', '5555555555', TRUE);

-- Ensure the users table exists (dependency for cases)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'dispatcher', 'patrol_officer', 'armory_officer', 'front_desk_officer', 'temporary_cells_manager', 'surveillance_officer') NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- Ensure the patrol_units table exists (dependency for emergency_calls)
CREATE TABLE IF NOT EXISTS patrol_units (
    unit_id INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(50),
    officers_assigned TEXT
) ENGINE=InnoDB;

-- Ensure the cases table exists
CREATE TABLE IF NOT EXISTS cases (
    case_id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
    assigned_officer INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    FOREIGN KEY (assigned_officer) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Ensure the emergency_calls table exists
CREATE TABLE IF NOT EXISTS emergency_calls (
    call_id INT AUTO_INCREMENT PRIMARY KEY,
    caller_name VARCHAR(100),
    caller_phone VARCHAR(20),
    location TEXT,
    description TEXT,
    status ENUM('received', 'dispatched', 'resolved', 'canceled') DEFAULT 'received',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    assigned_unit INT,
    FOREIGN KEY (assigned_unit) REFERENCES patrol_units(unit_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Database: PoliceStationDashboard

-- Additional tables for enhanced functionality

-- Emergency Calls Tracking Table
-- First, ensure patrol_units table exists
CREATE TABLE IF NOT EXISTS patrol_units (
    unit_id INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(50),
    officers_assigned TEXT
);

-- Then create emergency_calls table
CREATE TABLE emergency_calls (
    call_id INT AUTO_INCREMENT PRIMARY KEY,
    caller_name VARCHAR(100),
    caller_phone VARCHAR(20),
    location TEXT,
    description TEXT,
    status ENUM('received', 'dispatched', 'resolved', 'canceled') DEFAULT 'received',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    assigned_unit INT,
    FOREIGN KEY (assigned_unit) REFERENCES patrol_units(unit_id) ON DELETE SET NULL
);

CREATE TABLE emergency_calls (
    call_id INT AUTO_INCREMENT PRIMARY KEY,
    caller_name VARCHAR(100),
    caller_phone VARCHAR(20),
    location TEXT,
    description TEXT,
    status ENUM('received', 'dispatched', 'resolved', 'canceled') DEFAULT 'received',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    assigned_unit INT,
    FOREIGN KEY (assigned_unit) REFERENCES patrol_units(unit_id)
);

-- Performance and Analytics Table
CREATE TABLE daily_statistics (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    total_cases_opened INT DEFAULT 0,
    total_cases_closed INT DEFAULT 0,
    total_emergency_calls INT DEFAULT 0,
    total_officers_on_duty INT DEFAULT 0,
    total_pending_reports INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stored Procedure to Update Daily Statistics
DELIMITER //

CREATE PROCEDURE UpdateDailyStatistics()
BEGIN
    -- Insert or update daily statistics
    INSERT INTO daily_statistics (
        date, 
        total_cases_opened, 
        total_cases_closed, 
        total_emergency_calls, 
        total_officers_on_duty,
        total_pending_reports
    ) VALUES (
        CURRENT_DATE,
        (SELECT COUNT(*) FROM cases WHERE created_at >= CURRENT_DATE),
        (SELECT COUNT(*) FROM cases WHERE status = 'closed' AND closed_at >= CURRENT_DATE),
        (SELECT COUNT(*) FROM emergency_calls WHERE received_at >= CURRENT_DATE),
        (SELECT COUNT(*) FROM officer_profiles WHERE duty_status = 'on_duty'),
        (SELECT COUNT(*) FROM reports WHERE created_at >= CURRENT_DATE)
    ) ON DUPLICATE KEY UPDATE 
        total_cases_opened = VALUES(total_cases_opened),
        total_cases_closed = VALUES(total_cases_closed),
        total_emergency_calls = VALUES(total_emergency_calls),
        total_officers_on_duty = VALUES(total_officers_on_duty),
        total_pending_reports = VALUES(total_pending_reports);
END //

DELIMITER ;

-- Trigger to automatically update officer duty status
DELIMITER //

CREATE TRIGGER update_officer_duty_status 
BEFORE INSERT ON dispatch_assignments
FOR EACH ROW
BEGIN
    UPDATE officer_profiles 
    SET duty_status = 'on_duty' 
    WHERE user_id = NEW.officer_id;
END //

DELIMITER ;

-- Modify existing cases table to add closed_at timestamp
ALTER TABLE cases 
ADD COLUMN closed_at TIMESTAMP NULL;

-- View for Dashboard Real-Time Statistics
CREATE VIEW dashboard_statistics AS 
SELECT 
    (SELECT COUNT(*) FROM cases WHERE status != 'closed') AS open_cases,
    (SELECT COUNT(*) FROM officer_profiles WHERE duty_status = 'on_duty') AS officers_on_duty,
    (SELECT COUNT(*) FROM emergency_calls WHERE status != 'resolved') AS pending_emergency_calls,
    (SELECT COUNT(*) FROM reports WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)) AS pending_reports;

-- Sample Data Insertion Procedure
DELIMITER //

CREATE PROCEDURE InsertSampleData()
BEGIN
    -- Insert sample users
    INSERT INTO users (username, password_hash, role, first_name, last_name) VALUES
    ('john_doe', 'hashed_password_1', 'patrol_officer', 'John', 'Doe'),
    ('jane_smith', 'hashed_password_2', 'dispatcher', 'Jane', 'Smith');

    -- Insert sample officers
    INSERT INTO officer_profiles (user_id, rank, duty_status) VALUES
    ((SELECT user_id FROM users WHERE username = 'john_doe'), 'Sergeant', 'on_duty'),
    ((SELECT user_id FROM users WHERE username = 'jane_smith'), 'Lieutenant', 'on_duty');

    -- Insert sample cases
    INSERT INTO cases (description, status, assigned_officer) VALUES
    ('Robbery Investigation', 'open', (SELECT user_id FROM users WHERE username = 'john_doe')),
    ('Missing Person', 'in_progress', (SELECT user_id FROM users WHERE username = 'john_doe'));

    -- Insert sample emergency calls
    INSERT INTO emergency_calls (caller_name, caller_phone, location, description, status) VALUES
    ('Anonymous', '911', 'Downtown Area', 'Suspicious Activity', 'received'),
    ('Citizen', '112', 'Residential Zone', 'Noise Complaint', 'dispatched');
END //

DELIMITER ;

-- Scheduled Event to Update Daily Statistics
CREATE EVENT daily_stats_update
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    CALL UpdateDailyStatistics();

-- Table: users (Users Table)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'dispatcher', 'patrol_officer', 'armory_officer', 'front_desk_officer', 'temporary_cells_manager', 'surveillance_officer') NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    active BOOLEAN DEFAULT TRUE
);

-- Table: citizens (Citizens Table)
CREATE TABLE citizens (
    citizen_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    phone_number VARCHAR(20),
    driver_license VARCHAR(20),
    license_expiry DATE,
    vehicle_make VARCHAR(50),
    vehicle_model VARCHAR(50),
    vehicle_color VARCHAR(50),
    vehicle_plate VARCHAR(20),
    criminal_record BOOLEAN DEFAULT FALSE
);

-- Table: weapons (Weapons Table)
CREATE TABLE weapons (
    weapon_id INT AUTO_INCREMENT PRIMARY KEY,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('pistol', 'rifle', 'shotgun', 'taser') NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    purchase_date DATE,
    assigned_to INT,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

-- Table: vehicles (Vehicles Table)
CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(50),
    plate_number VARCHAR(20) UNIQUE,
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES citizens(citizen_id)
);

-- Table: cases (Cases Table)
CREATE TABLE cases (
    case_id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
    assigned_officer INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_officer) REFERENCES users(user_id)
);

-- Table: officer_profiles (Officer Profiles Table)
CREATE TABLE officer_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    rank VARCHAR(50),
    duty_status ENUM('on_duty', 'off_duty') DEFAULT 'off_duty',
    health_status VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table: dispatch_assignments (Dispatch Assignments Table)
CREATE TABLE dispatch_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    officer_id INT,
    dispatched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(case_id),
    FOREIGN KEY (officer_id) REFERENCES users(user_id)
);

-- Table: inventory (Inventory Table)
CREATE TABLE inventory (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    category ENUM('weapon', 'equipment', 'vehicle'),
    condition ENUM('new', 'used', 'damaged'),
    quantity INT,
    assigned_to INT,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

-- Table: cctv_logs (CCTV Logs Table)
CREATE TABLE cctv_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    camera_location VARCHAR(100),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_description TEXT
);

-- Table: reports (Reports Table)
CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    content TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Table: patrol_units (Patrol Units Table)
CREATE TABLE patrol_units (
    unit_id INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(50),
    officers_assigned TEXT
);

-- Table: health_monitoring (Health Monitoring Table)
CREATE TABLE health_monitoring (
    monitor_id INT AUTO_INCREMENT PRIMARY KEY,
    officer_id INT,
    heart_rate INT,
    activity_level ENUM('low', 'medium', 'high'),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (officer_id) REFERENCES users(user_id)
);

-- Table: error_logs (Error Logs Table)
CREATE TABLE error_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    error_message TEXT,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);