-- Create aid_programs table
CREATE TABLE IF NOT EXISTS aid_programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    resource_allocation JSON NOT NULL,
    assigned_barangay VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Update farmers table to match the Farmer type
CREATE TABLE IF NOT EXISTS farmers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) DEFAULT '/images/user/default-user.png',
    birthday DATE NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'LGBTQ+') NOT NULL,
    contact_number VARCHAR(20),
    farm_location VARCHAR(255) NOT NULL,
    land_size VARCHAR(50) NOT NULL,
    farm_owner BOOLEAN DEFAULT false,
    income DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create crops table
CREATE TABLE IF NOT EXISTS crops (
    id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    season VARCHAR(50) NOT NULL,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- Create aid_allocations table
CREATE TABLE IF NOT EXISTS aid_allocations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    aid_program_id INT NOT NULL,
    farmer_id VARCHAR(50) NOT NULL,
    quantity_received VARCHAR(50),
    distribution_date DATETIME,
    status ENUM('Distributed', 'Pending', 'Cancelled') NOT NULL DEFAULT 'Pending',
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aid_program_id) REFERENCES aid_programs(id),
    FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX idx_aid_program_category ON aid_programs(category);
CREATE INDEX idx_farmer_name ON farmers(name);
CREATE INDEX idx_farmer_location ON farmers(farm_location);
CREATE INDEX idx_aid_allocation_status ON aid_allocations(status);
CREATE INDEX idx_aid_allocation_date ON aid_allocations(distribution_date);
CREATE INDEX idx_username ON admin_users(username);