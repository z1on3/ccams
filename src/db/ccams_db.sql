-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2025 at 03:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ccams_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` enum('admin','staff') NOT NULL DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password`, `name`, `role`, `created_at`, `updated_at`) VALUES
(1, 'SuperAdmin', '$2y$10$btjQhHVY1OznvzmD6hmQl.m54Y/m1OwZrWjNKz2m2lBUG7D8oSdzq', 'Super Admin', 'admin', '2024-12-14 16:28:18', '2024-12-14 16:29:04'),
(2, 'ict1', '$2a$10$dcAUSGkq5iDBjkU2jldvQOkNuf4Eu/MK1imMEqstB.twEgABvOwum', 'Ict Office', 'staff', '2025-02-15 17:27:05', '2025-02-15 17:27:05');

-- --------------------------------------------------------

--
-- Table structure for table `aid_allocations`
--

CREATE TABLE `aid_allocations` (
  `id` int(11) NOT NULL,
  `aid_program_id` int(11) NOT NULL,
  `farmer_id` varchar(50) NOT NULL,
  `quantity_received` varchar(50) DEFAULT NULL,
  `distribution_date` datetime DEFAULT NULL,
  `status` enum('Distributed','Pending','Cancelled') NOT NULL DEFAULT 'Pending',
  `remarks` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aid_allocations`
--

INSERT INTO `aid_allocations` (`id`, `aid_program_id`, `farmer_id`, `quantity_received`, `distribution_date`, `status`, `remarks`, `created_at`, `updated_at`) VALUES
(13, 3, '1734186816597', '₱1000', '2025-02-15 15:06:56', 'Distributed', NULL, '2025-02-15 15:06:56', '2025-02-15 15:06:56'),
(14, 5, '1734186816597', '₱0', '2025-02-16 01:55:44', 'Distributed', NULL, '2025-02-16 01:55:44', '2025-02-16 01:55:44'),
(15, 4, '1734173147373', '10 (kg) Fertilizer', '2025-02-16 01:58:19', 'Distributed', NULL, '2025-02-16 01:58:19', '2025-02-16 01:58:19'),
(16, 4, '1734191863985', '100 (kg) Fertilizer', '2025-02-16 02:03:17', 'Distributed', NULL, '2025-02-16 02:03:17', '2025-02-16 02:03:17'),
(17, 1, '1734173147373', '1 Karabao', '2025-02-16 02:25:24', 'Distributed', NULL, '2025-02-16 02:25:24', '2025-02-16 02:25:24'),
(18, 1, '1734186816597', '1 Karabao', '2025-02-16 02:25:24', 'Distributed', NULL, '2025-02-16 02:25:24', '2025-02-16 02:25:24'),
(19, 1, '1734190878468', '1 Karabao', '2025-02-16 02:25:24', 'Distributed', NULL, '2025-02-16 02:25:24', '2025-02-16 02:25:24'),
(20, 1, '1734191863985', '1 Karabao', '2025-02-16 02:25:24', 'Distributed', NULL, '2025-02-16 02:25:24', '2025-02-16 02:25:24');

-- --------------------------------------------------------

--
-- Table structure for table `aid_programs`
--

CREATE TABLE `aid_programs` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `resource_allocation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`resource_allocation`)),
  `assigned_barangay` varchar(100) NOT NULL,
  `eligibility` varchar(500) NOT NULL,
  `farmer_type` varchar(500) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aid_programs`
--

INSERT INTO `aid_programs` (`id`, `name`, `category`, `resource_allocation`, `assigned_barangay`, `eligibility`, `farmer_type`, `created_at`, `updated_at`) VALUES
(1, 'Kalabaw Para sa Lahat', 'Livestock and Poultry Assistance', '{\"type\":\"Karabao\",\"quantity\":\"10\",\"budget\":\"100000\"}', 'All Barangays', '{\"min_income\":\"\",\"max_income\":\"\",\"min_land_size\":\"\",\"max_land_size\":\"\",\"land_ownership_type\":\"\",\"last_updated\":\"\"}', '[\"Rice Farmer\"]', '2024-12-14 17:02:02', '2025-02-16 02:24:13'),
(2, 'Kalabaw Para sa Lahat - BACONG', 'Farm Tools and Equipment', '{\"type\":\"Karabao\",\"quantity\":\"25\",\"budget\":\"250000\"}', 'Bacong', '{\"min_income\":\"0\",\"max_income\":\"0\",\"min_land_size\":\"\",\"max_land_size\":\"\",\"land_ownership_type\":\"\",\"last_updated\":\"2025-02-05\"}', '[]', '2024-12-14 17:08:16', '2025-02-16 01:02:35'),
(3, 'AKAP: Alalay sa Kabuhayan at Agrikulturang Pinansyal', 'Financial Assistance', '{\"type\":\"Finacial Aid\",\"quantity\":\"10000\",\"budget\":\"10000\"}', 'All Barangays', '{\"min_income\":\"10000\",\"max_income\":\"10000\",\"min_land_size\":\"2\",\"max_land_size\":\"2\",\"land_ownership_type\":\"\",\"last_updated\":\"2025-02-03\"}', '[\"Coconut Farmer\"]', '2024-12-14 22:54:29', '2025-02-16 01:31:57'),
(4, 'Fertilizer Para sa Lahat', 'Fertilizer Support', '{\"type\":\"(kg) Fertilizer\",\"quantity\":\"200\",\"budget\":\"20000\"}', 'Real', '', '', '2024-12-15 01:42:58', '2024-12-15 01:43:20'),
(5, 'ALL BARANGAY PROGRAM', 'Financial Assistance', '{\"type\":\"Finacial Aid\",\"quantity\":\"10000\",\"budget\":\"10000\"}', 'All Barangays', '{\"min_income\":\"0\",\"max_income\":\"0\",\"min_land_size\":\"0\",\"max_land_size\":\"0\",\"land_ownership_type\":\"Tenant\",\"last_updated\":\"2025-02-03\"}', '[]', '2025-02-15 16:41:45', '2025-02-16 02:26:32');

-- --------------------------------------------------------

--
-- Table structure for table `aid_requests`
--

CREATE TABLE `aid_requests` (
  `id` int(10) UNSIGNED NOT NULL,
  `category` varchar(100) NOT NULL,
  `req_note` varchar(1000) NOT NULL,
  `aid_program_id` int(11) DEFAULT NULL,
  `farmer_id` varchar(50) NOT NULL,
  `request_date` datetime NOT NULL,
  `distribution_date` datetime DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `aid_allocation_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aid_requests`
--

INSERT INTO `aid_requests` (`id`, `category`, `req_note`, `aid_program_id`, `farmer_id`, `request_date`, `distribution_date`, `status`, `aid_allocation_id`) VALUES
(4, 'Financial Assistance', 'Need Help Thanks!', NULL, '1734186816597', '2025-02-16 16:06:48', NULL, 'Pending', NULL),
(5, 'Seed Distribution', 'Need Help Again', NULL, '1734186816597', '2025-02-16 16:12:33', NULL, 'Pending', NULL),
(6, 'Seed Distribution', 'Helppppp!!', NULL, '1734186816597', '2025-02-16 16:13:07', NULL, 'Pending', NULL),
(7, 'Financial Assistance', 'Need Help, Frrrr', NULL, '1734186816597', '2025-02-16 16:16:39', NULL, 'Pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `crops`
--

CREATE TABLE `crops` (
  `id` int(11) NOT NULL,
  `farmer_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `season` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `crops`
--

INSERT INTO `crops` (`id`, `farmer_id`, `name`, `season`) VALUES
(27, '1734192115852', 'Rice', 'Wet'),
(28, '1734192115852', 'Wheat', 'Wet'),
(29, '1734192115852', 'Soybean', 'Wet'),
(30, '1734192115852', 'Coconut', 'Dry'),
(31, '1734192115852', 'Cassava', 'Dry'),
(32, '1734192115852', 'Sweet Potato', 'Dry');

-- --------------------------------------------------------

--
-- Table structure for table `farmers`
--

CREATE TABLE `farmers` (
  `id` varchar(50) NOT NULL,
  `username` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('M','F','Other') DEFAULT 'Other',
  `birthday` date NOT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `email` bigint(20) DEFAULT NULL,
  `farm_location` varchar(100) NOT NULL,
  `land_size` varchar(50) NOT NULL,
  `farm_owner` tinyint(1) NOT NULL DEFAULT 0,
  `farm_ownership_type` enum('Land Owner','Tenant') DEFAULT NULL,
  `farmer_type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`farmer_type`)),
  `reg_date` datetime NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `income` decimal(10,2) NOT NULL,
  `family_members` int(11) NOT NULL DEFAULT 0,
  `aid_requested` varchar(50) DEFAULT NULL,
  `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`status`)),
  `distribution_date` datetime DEFAULT NULL,
  `identification_no` varchar(50) DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farmers`
--

INSERT INTO `farmers` (`id`, `username`, `image`, `name`, `age`, `gender`, `birthday`, `phone`, `email`, `farm_location`, `land_size`, `farm_owner`, `farm_ownership_type`, `farmer_type`, `reg_date`, `active`, `income`, `family_members`, `aid_requested`, `status`, `distribution_date`, `identification_no`, `remarks`) VALUES
('1622094671423', '', '/images/user/1739632257658-266357764-passportsize_picture_with-nametag.png', 'fsfefse dwadawd', 23, NULL, '2002-02-04', NULL, NULL, 'San Isidro', '100 sqm', 1, 'Land Owner', '[\"Coconut Farmer\",\"Rice Farmer\",\"Fruit & Vegetables\",\"Poultry Farmers\"]', '2025-02-15 23:12:14', 0, 10.00, 0, NULL, NULL, NULL, NULL, NULL),
('1734173147373', 'santos.maria@real', '/images/user/1734173082440-443139914-images.jpg', 'Maria Santos', 45, 'F', '2222-01-23', 0, NULL, 'Real', '456 ha', 0, 'Tenant', '[\"Rice Farmer\"]', '2024-12-14 18:45:47', 1, 10000.00, 0, NULL, NULL, NULL, NULL, NULL),
('1734186816597', 'cruz.juan@zarah', '/images/user/1734186736733-825966949-user-03.png', 'Juan Dela Cruz', 56, 'M', '1988-05-22', 0, NULL, 'Zarah', '200 sqm', 0, 'Tenant', '[\"Coconut Farmer\",\"Rice Farmer\"]', '2024-12-14 22:33:36', 1, 7000.00, 0, NULL, NULL, NULL, NULL, NULL),
('1734190878468', 'daliday.ricardo@sanjose', '/images/user/1734190804334-382275844-user-02.png', 'Ricardo Daliday', 45, 'M', '1999-02-22', 0, NULL, 'San Jose', '900 ha', 0, 'Land Owner', '[\"Coconut Farmer\",\"Rice Farmer\",\"Fruit & Vegetables\",\"Poultry Farmers\"]', '2024-12-14 23:41:18', 1, 100000.00, 0, NULL, NULL, NULL, NULL, NULL),
('1734191863985', 'gonzales.maricel@real', '/images/user/1734191835844-279346572-user-05.png', 'Maricel Gonzales', 36, 'Other', '1988-05-02', 0, NULL, 'Real', '2 ha', 0, 'Tenant', '[\"Rice Farmer\"]', '2024-12-14 23:57:43', 1, 20000.00, 0, NULL, NULL, NULL, NULL, NULL),
('1734192115852', 'santos.danilo@real', '/images/user/1734192026556-921224357-user-04.png', 'Danilo Santos', 48, 'Other', '1976-02-02', 0, NULL, 'Real', '200 sqm', 0, 'Tenant', '[\"Coconut Farmer\"]', '2024-12-15 00:01:55', 0, 7000.00, 0, NULL, NULL, NULL, NULL, NULL),
('3162040500513', '', '/images/user/1739632257658-266357764-passportsize_picture_with-nametag.png', 'fsfefse', 23, NULL, '2002-02-04', NULL, NULL, 'San Isidro', '100 sqm', 1, 'Land Owner', '[\"Coconut Farmer\",\"Rice Farmer\",\"Fruit & Vegetables\",\"Poultry Farmers\"]', '2025-02-15 23:11:56', 0, 10.00, 0, NULL, NULL, NULL, NULL, NULL),
('5163623282837', '', '/images/user/1739632257658-266357764-passportsize_picture_with-nametag.png', 'fsfefse', 23, NULL, '2002-02-04', NULL, NULL, 'San Isidro', '100 sqm', 1, 'Land Owner', '[\"Coconut Farmer\",\"Rice Farmer\",\"Fruit & Vegetables\",\"Poultry Farmers\"]', '2025-02-15 23:11:37', 0, 10.00, 0, NULL, NULL, NULL, NULL, NULL),
('7554179093077', 'farmer.wadawd@nonongsenior', '/images/user/1739632578086-243035833-wider.png', 'wadawd', 24, NULL, '2001-02-05', NULL, NULL, 'Nonong Senior', '', 0, 'Land Owner', '[\"Rice Farmer\"]', '2025-02-15 23:16:34', 0, 10.00, 0, NULL, NULL, NULL, NULL, NULL),
('9628001110008', 'vii.carlo@nonongsenior', '/images/user/1738496266238-355342467-passportsize_picture_no-nametag.png', 'Carlo Vii', 22, 'M', '2002-02-19', 0, NULL, 'Nonong Senior', '200 sqm', 0, 'Tenant', '[\"Coconut Farmer\",\"Rice Farmer\",\"Fruit & Vegetables\",\"Poultry Farmers\"]', '2025-02-02 23:05:09', 0, 10000.00, 0, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `farm_photos`
--

CREATE TABLE `farm_photos` (
  `id` int(11) NOT NULL,
  `farmer_id` varchar(36) NOT NULL,
  `photo_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farm_photos`
--

INSERT INTO `farm_photos` (`id`, `farmer_id`, `photo_url`, `created_at`) VALUES
(2, '1734173147373', '/images/user/1734235751591-438715753-FFPbelltown2-1-1536x1030.min-800x600.png', '2024-12-15 04:09:12'),
(3, '1734173147373', '/images/user/1734235751700-402636821-pexels-alejandro-barron-21404-96715.jpg', '2024-12-15 04:09:12'),
(4, '1734186816597', '/images/user/1734237684341-678058441-304892190_464040052404368_647887662755920607_n.jpg', '2024-12-15 04:41:24'),
(5, '1734173147373', '/images/user/1734237949868-709017721-304892190_464040052404368_647887662755920607_n.jpg', '2024-12-15 04:45:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `aid_allocations`
--
ALTER TABLE `aid_allocations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aid_program_id` (`aid_program_id`),
  ADD KEY `farmer_id` (`farmer_id`),
  ADD KEY `idx_aid_allocation_status` (`status`),
  ADD KEY `idx_aid_allocation_date` (`distribution_date`);

--
-- Indexes for table `aid_programs`
--
ALTER TABLE `aid_programs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_aid_program_category` (`category`);

--
-- Indexes for table `aid_requests`
--
ALTER TABLE `aid_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aid_program_id` (`aid_program_id`),
  ADD KEY `farmer_id` (`farmer_id`),
  ADD KEY `fk_aid_allocation` (`aid_allocation_id`);

--
-- Indexes for table `crops`
--
ALTER TABLE `crops`
  ADD PRIMARY KEY (`id`),
  ADD KEY `farmer_id` (`farmer_id`);

--
-- Indexes for table `farmers`
--
ALTER TABLE `farmers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identification_no` (`identification_no`),
  ADD KEY `idx_farmer_name` (`name`),
  ADD KEY `idx_farmer_location` (`farm_location`),
  ADD KEY `idx_farm_ownership_type` (`farm_ownership_type`),
  ADD KEY `idx_farmer_type` (`farmer_type`(768));

--
-- Indexes for table `farm_photos`
--
ALTER TABLE `farm_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `farmer_id` (`farmer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `aid_allocations`
--
ALTER TABLE `aid_allocations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `aid_programs`
--
ALTER TABLE `aid_programs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `aid_requests`
--
ALTER TABLE `aid_requests`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `crops`
--
ALTER TABLE `crops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `farm_photos`
--
ALTER TABLE `farm_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `aid_allocations`
--
ALTER TABLE `aid_allocations`
  ADD CONSTRAINT `aid_allocations_ibfk_1` FOREIGN KEY (`aid_program_id`) REFERENCES `aid_programs` (`id`),
  ADD CONSTRAINT `aid_allocations_ibfk_2` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`);

--
-- Constraints for table `aid_requests`
--
ALTER TABLE `aid_requests`
  ADD CONSTRAINT `aid_requests_ibfk_1` FOREIGN KEY (`aid_program_id`) REFERENCES `aid_programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `aid_requests_ibfk_2` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_aid_allocation` FOREIGN KEY (`aid_allocation_id`) REFERENCES `aid_allocations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `crops`
--
ALTER TABLE `crops`
  ADD CONSTRAINT `crops_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`);

--
-- Constraints for table `farm_photos`
--
ALTER TABLE `farm_photos`
  ADD CONSTRAINT `farm_photos_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
