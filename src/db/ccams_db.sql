-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 15, 2024 at 07:50 AM
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
(1, 'SuperAdmin', '$2y$10$btjQhHVY1OznvzmD6hmQl.m54Y/m1OwZrWjNKz2m2lBUG7D8oSdzq', 'Super Admin', 'admin', '2024-12-14 16:28:18', '2024-12-14 16:29:04');

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
(10, 1, '1734173147373', '1 Karabao', '2024-12-15 13:34:59', 'Distributed', NULL, '2024-12-15 13:34:59', '2024-12-15 13:34:59'),
(11, 1, '1734191863985', '1 Karabao', '2024-12-15 13:34:59', 'Distributed', NULL, '2024-12-15 13:34:59', '2024-12-15 13:34:59'),
(12, 1, '1734192115852', '1 Karabao', '2024-12-15 13:34:59', 'Distributed', NULL, '2024-12-15 13:34:59', '2024-12-15 13:34:59');

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
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aid_programs`
--

INSERT INTO `aid_programs` (`id`, `name`, `category`, `resource_allocation`, `assigned_barangay`, `created_at`, `updated_at`) VALUES
(1, 'Kalabaw Para sa Lahat', 'Livestock and Poultry Assistance', '{\"type\":\"Karabao\",\"quantity\":\"10\",\"budget\":\"100000\"}', 'Real', '2024-12-14 17:02:02', '2024-12-15 01:31:12'),
(2, 'Kalabaw Para sa Lahat - BACONG', 'Livestock and Poultry Assistance', '{\"type\":\"Karabao\",\"quantity\":\"25\",\"budget\":\"250000\"}', 'Bacong', '2024-12-14 17:08:16', '2024-12-14 22:43:04'),
(3, 'AKAP: Alalay sa Kabuhayan at Agrikulturang Pinansyal', 'Financial Assistance', '{\"type\":\"Finacial Aid\",\"quantity\":\"200000\",\"budget\":\"200000\"}', 'Zarah', '2024-12-14 22:54:29', '2024-12-14 22:54:29'),
(4, 'Fertilizer Para sa Lahat', 'Fertilizer Support', '{\"type\":\"(kg) Fertilizer\",\"quantity\":\"200\",\"budget\":\"20000\"}', 'Real', '2024-12-15 01:42:58', '2024-12-15 01:43:20');

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
(4, '1734173147373', 'Rice', 'Wet'),
(5, '1734173147373', 'Corn', 'Dry'),
(8, '1734190878468', 'Corn', 'Wet'),
(9, '1734190878468', 'Corn', 'Dry'),
(10, '1734191863985', 'Mango', 'Wet'),
(11, '1734191863985', 'Rice', 'Wet'),
(12, '1734191863985', 'Coffee', 'Wet'),
(13, '1734191863985', 'Sugarcane', 'Dry'),
(14, '1734191863985', 'Wheat', 'Dry'),
(15, '1734191863985', 'Cassava', 'Dry'),
(16, '1734192115852', 'Wheat', 'Wet'),
(17, '1734192115852', 'Soybean', 'Wet'),
(18, '1734192115852', 'Corn', 'Wet'),
(19, '1734192115852', 'Watermelon', 'Dry'),
(20, '1734192115852', 'Eggplant', 'Dry'),
(21, '1734192115852', 'Guava', 'Dry');

-- --------------------------------------------------------

--
-- Table structure for table `farmers`
--

CREATE TABLE `farmers` (
  `id` varchar(50) NOT NULL,
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

INSERT INTO `farmers` (`id`, `image`, `name`, `age`, `gender`, `birthday`, `phone`, `email`, `farm_location`, `land_size`, `farm_owner`, `reg_date`, `active`, `income`, `family_members`, `aid_requested`, `status`, `distribution_date`, `identification_no`, `remarks`) VALUES
('1734173147373', '/images/user/1734173082440-443139914-images.jpg', 'Maria Santos', 45, 'F', '2222-01-23', 342423423, NULL, 'Real', '456 ha', 0, '2024-12-14 18:45:47', 1, 10000.00, 0, NULL, NULL, NULL, NULL, NULL),
('1734186816597', '/images/user/1734186736733-825966949-user-03.png', 'Juan Dela Cruz', 56, '', '1988-05-22', 123, NULL, 'Zarah', '200 sqm', 0, '2024-12-14 22:33:36', 1, 7000.00, 0, NULL, NULL, NULL, NULL, NULL),
('1734190878468', '/images/user/1734190804334-382275844-user-02.png', 'Ricardo Daliday', 45, 'M', '1999-02-22', NULL, NULL, 'San Jose', '900 ha', 1, '2024-12-14 23:41:18', 1, 100000.00, 0, NULL, NULL, NULL, NULL, NULL),
('1734191863985', '/images/user/1734191835844-279346572-user-05.png', 'Maricel Gonzales', 36, 'Other', '1988-05-02', NULL, NULL, 'Real', '2 ha', 0, '2024-12-14 23:57:43', 1, 20000.00, 0, NULL, NULL, NULL, NULL, NULL),
('1734192115852', '/images/user/1734192026556-921224357-user-04.png', 'Danilo Santos', 48, 'Other', '1976-02-02', NULL, NULL, 'Real', '200 sqm', 0, '2024-12-15 00:01:55', 1, 7000.00, 0, NULL, NULL, NULL, NULL, NULL);

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
  ADD KEY `idx_farmer_location` (`farm_location`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `aid_allocations`
--
ALTER TABLE `aid_allocations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `aid_programs`
--
ALTER TABLE `aid_programs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `crops`
--
ALTER TABLE `crops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `farm_photos`
--
ALTER TABLE `farm_photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
