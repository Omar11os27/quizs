-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2026 at 10:38 PM
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
-- Database: `quiz_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `option_text` varchar(255) NOT NULL,
  `is_correct` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `options`
--

INSERT INTO `options` (`id`, `question_id`, `option_text`, `is_correct`) VALUES
(10, 3, 'عمر', 1),
(11, 3, 'خالد', 0),
(12, 3, 'عبدالله', 0),
(13, 3, 'حسن', 0),
(20, 8, '10 سنوات', 0),
(21, 8, '20 سنة', 1),
(22, 8, 'سنتين', 0),
(23, 8, '5 سنوات', 0),
(24, 9, 'المشتري', 0),
(25, 9, 'المريخ', 0),
(26, 9, 'زحل', 1),
(27, 9, 'نبتون', 0),
(28, 10, 'الأكسجين', 0),
(29, 10, 'النيتروجين', 1),
(30, 10, 'ثاني أكسيد الكربون', 0),
(31, 10, 'الأرجون', 0),
(32, 11, 'الصين', 0),
(33, 11, 'كوريا الشمالية', 0),
(34, 11, 'اليابان', 1),
(35, 11, 'تايلاند', 0),
(36, 12, 'النيل', 0),
(37, 12, 'الامازون', 0),
(38, 12, 'الدانوب', 1),
(39, 12, 'الميسيسيبي', 0);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `question_text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `question_text`) VALUES
(3, 'ماهو اسمك؟'),
(8, 'ماهو عمرك؟'),
(9, 'ما هو الكوكب الذي يمتلك أكبر عدد من الأقمار في مجموعتنا الشمسية؟'),
(10, 'ما هو الغاز الذي يشكل النسبة الأكبر من الغلاف الجوي للأرض؟'),
(11, 'ما هي \"أرض الشمس المشرقة\"؟'),
(12, 'ما هو النهر الذي يمر في أكبر عدد من الدول؟');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_matches`
--

CREATE TABLE `quiz_matches` (
  `id` int(11) NOT NULL,
  `match_order` int(11) NOT NULL,
  `teamA_id` int(11) NOT NULL,
  `teamB_id` int(11) NOT NULL,
  `teamA_score` int(11) DEFAULT 0,
  `teamB_score` int(11) DEFAULT 0,
  `match_status` enum('pending','live','finished') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_matches`
--

INSERT INTO `quiz_matches` (`id`, `match_order`, `teamA_id`, `teamB_id`, `teamA_score`, `teamB_score`, `match_status`) VALUES
(1, 1, 1, 2, 0, 0, 'pending'),
(2, 2, 3, 2, 0, 0, 'pending'),
(3, 3, 9, 1, 0, 0, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `state` varchar(25) DEFAULT NULL,
  `number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `team_name`, `state`, `number`) VALUES
(1, 'كلية علوم الحاسوب وتكنولوجيا المعلومات', NULL, 1),
(2, 'كلية العلوم', NULL, 2),
(3, 'كلية الآداب', NULL, 3),
(4, 'كلية الإدارة والإقتصاد', NULL, 4),
(5, 'كلية التربية البدنية وعلوم الرياضة', NULL, 5),
(6, 'كلية التربية للبنات', NULL, 6),
(7, 'كلية التربية للعلوم الانسانية', NULL, 7),
(8, 'كلية التربية للعلوم الصرفة', NULL, 8),
(9, 'كلية الصيدلة', NULL, 9),
(10, 'كلية الطب', NULL, 10),
(11, 'كلية القانون', NULL, 11),
(12, 'كلية العلوم الاسلامية', NULL, 12),
(13, 'كلية العلوم السياسية', NULL, 13);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_matches`
--
ALTER TABLE `quiz_matches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teamA_id` (`teamA_id`),
  ADD KEY `teamB_id` (`teamB_id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `quiz_matches`
--
ALTER TABLE `quiz_matches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_matches`
--
ALTER TABLE `quiz_matches`
  ADD CONSTRAINT `quiz_matches_ibfk_1` FOREIGN KEY (`teamA_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_matches_ibfk_2` FOREIGN KEY (`teamB_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
