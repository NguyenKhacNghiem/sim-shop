-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2024 at 06:16 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webbansim`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

create database webbansim;
use webbansim;

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `total` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `total`) VALUES
(0, 0),
(1, 8050000),
(2, 419000);

-- --------------------------------------------------------

--
-- Table structure for table `datapack`
--

CREATE TABLE `datapack` (
  `id` varchar(20) NOT NULL,
  `price` int(11) NOT NULL,
  `cycle` int(11) NOT NULL,
  `description` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `datapack`
--

INSERT INTO `datapack` (`id`, `price`, `cycle`, `description`) VALUES
('flex 12t', 880000, 12, '5GB tốc độ cao/ngày; Hết dung lượng tốc độ cao, ngắt kết nối Internet; Miễn phí data truy cập FPT Play'),
('flex 1t', 88000, 1, '5GB tốc độ cao/ngày; Hết dung lượng tốc độ cao, ngắt kết nối Internet; Miễn phí data truy cập FPT Play'),
('flex108 6t', 540000, 6, '8GB tốc độ cao/ngày; Hết dung lượng tốc độ cao, ngắt kết nối Internet; Miễn phí data truy cập FPT Play'),
('flex69 1t', 69000, 1, '4GB tốc độ cao/ngày; Hết dung lượng tốc độ cao, ngắt kết nối Internet; Miễn phí data truy cập FPT Play'),
('flex69 3t', 207000, 3, '4GB tốc độ cao/ngày; Hết dung lượng tốc độ cao, ngắt kết nối Internet; Miễn phí data truy cập FPT Play');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(20) NOT NULL,
  `userPhone` varchar(20) NOT NULL,
  `total` int(11) NOT NULL,
  `date` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `userPhone`, `total`, `date`) VALUES
('27012024000000', '0982344125', 119000, '27/01/2024'),
('31122023000000', '0122388140', 138000, '31/12/2023');

-- --------------------------------------------------------

--
-- Table structure for table `sim`
--

CREATE TABLE `sim` (
  `code` varchar(20) NOT NULL,
  `price` int(11) NOT NULL,
  `selectionFee` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `provider` varchar(50) NOT NULL,
  `bought` int(11) NOT NULL,
  `deleted` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sim`
--

INSERT INTO `sim` (`code`, `price`, `selectionFee`, `type`, `provider`, `bought`, `deleted`) VALUES
('0123456789', 50000, 50000000, 'Sim tiến lên', 'Mobifone', 0, 0),
('0775611333', 50000, 300000, 'Sim số đẹp', 'Viettel', 0, 0),
('0775611930', 50000, 0, 'Sim bình thường', 'Mobifone', 0, 0),
('0775612091', 50000, 0, 'Sim bình thường', 'Viettel', 1, 0),
('0775612106', 50000, 0, 'Sim bình thường', 'Mobifone', 0, 0),
('0775612291', 50000, 0, 'Sim bình thường', 'Viettel', 1, 0),
('0775614567', 50000, 5000000, 'Sim tiến lên', 'Vinaphone', 0, 0),
('0775618888', 50000, 8000000, 'Sim tứ quý', 'Vinaphone', 0, 0),
('0775619999', 50000, 10000000, 'Sim tứ quý', 'Vietnamobile', 0, 0),
('0775682853', 50000, 0, 'Sim bình thường', 'Vietnamobile', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `simcart`
--

CREATE TABLE `simcart` (
  `simCode` varchar(20) NOT NULL,
  `cartId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `simcart`
--

INSERT INTO `simcart` (`simCode`, `cartId`) VALUES
('0775611333', 2),
('0775618888', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `phone` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `cartId` int(11) NOT NULL,
  `role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`phone`, `password`, `fullname`, `address`, `gender`, `cartId`, `role`) VALUES
('0122388140', '$2a$10$jaXk6X2Dcd07GLxV2ISSv.tU4ksEs2ciAs1PTKn5f0lE5Fnbj8igS', 'Trần Thành Trung', 'Số 388 đường Lê Hồng Phong, Phường 10, Quận 10, Thành phố Hồ Chí Minh', 'Nam', 1, 'customer'),
('0822789521', '$2a$10$VXlHqx4K5WBEvdMHACLrguws8VCwXSVXt0Cb7FXWpYsRKM6lG2hoW', '', '', '', 0, 'admin'),
('0982344125', '$2a$10$L/8Ngx4Wdb8b3apVQn8zZu/ZDblWJf1HWy7CRn9vC/kLl2Gr95KSW', 'Phan Mỹ Anh', 'Số 389 đường Lê Hồng Phong, Phường 10, Quận 10, Thành phố Hồ Chí Minh', 'Nữ', 2, 'customer');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `datapack`
--
ALTER TABLE `datapack`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customerPhone` (`userPhone`);

--
-- Indexes for table `sim`
--
ALTER TABLE `sim`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `simcart`
--
ALTER TABLE `simcart`
  ADD PRIMARY KEY (`simCode`,`cartId`),
  ADD KEY `simcart_ibfk_3` (`cartId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`phone`),
  ADD KEY `users_ibfk_1` (`cartId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userPhone`) REFERENCES `users` (`phone`);

--
-- Constraints for table `simcart`
--
ALTER TABLE `simcart`
  ADD CONSTRAINT `simcart_ibfk_1` FOREIGN KEY (`simCode`) REFERENCES `sim` (`code`),
  ADD CONSTRAINT `simcart_ibfk_2` FOREIGN KEY (`simCode`) REFERENCES `sim` (`code`),
  ADD CONSTRAINT `simcart_ibfk_3` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
