-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Gazdă: 127.0.0.1
-- Timp de generare: ian. 03, 2020 la 02:09 PM
-- Versiune server: 10.1.38-MariaDB
-- Versiune PHP: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Bază de date: `shopit`
--
CREATE DATABASE IF NOT EXISTS `shopit` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `shopit`;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `product`
--

CREATE TABLE `product` (
  `barcode` varchar(255) NOT NULL,
  `pname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `product`
--

INSERT INTO `product` (`barcode`, `pname`) VALUES
('5449000108357', 'Apa Dorna-plata 0.5l'),
('59421382', 'Marboro rosu lung'),
('9002490100070', 'REDBULL TATI');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `barcode` varchar(255) NOT NULL,
  `sid` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `store`
--

CREATE TABLE `store` (
  `sid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `adress` varchar(255) NOT NULL,
  `iban` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `transaction`
--

CREATE TABLE `transaction` (
  `tid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `user`
--

CREATE TABLE `user` (
  `uid` int(11) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `uname` varchar(255) NOT NULL,
  `pwd` varchar(255) NOT NULL,
  `cardno` varchar(255) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `user`
--

INSERT INTO `user` (`uid`, `fname`, `lname`, `uname`, `pwd`, `cardno`, `type`, `email`) VALUES
(1, 'Admin', 'Admin', 'admin', 'admin', '1234123412341234', 1, 'admin@shopit.com');

-- --------------------------------------------------------

--
-- Structură tabel pentru tabel `usercard`
--

CREATE TABLE `usercard` (
  `cardno` varchar(255) NOT NULL,
  `cvv` int(11) NOT NULL,
  `holdername` varchar(255) NOT NULL,
  `expdate` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Eliminarea datelor din tabel `usercard`
--

INSERT INTO `usercard` (`cardno`, `cvv`, `holdername`, `expdate`) VALUES
('1234123412341234', 123, 'ADMIN', '10/10');

--
-- Indexuri pentru tabele eliminate
--

--
-- Indexuri pentru tabele `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`barcode`);

--
-- Indexuri pentru tabele `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barcode` (`barcode`),
  ADD KEY `sid` (`sid`);

--
-- Indexuri pentru tabele `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`sid`);

--
-- Indexuri pentru tabele `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`tid`),
  ADD KEY `uid` (`uid`),
  ADD KEY `sid` (`sid`);

--
-- Indexuri pentru tabele `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `cardno` (`cardno`);

--
-- Indexuri pentru tabele `usercard`
--
ALTER TABLE `usercard`
  ADD PRIMARY KEY (`cardno`);

--
-- AUTO_INCREMENT pentru tabele eliminate
--

--
-- AUTO_INCREMENT pentru tabele `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `store`
--
ALTER TABLE `store`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `transaction`
--
ALTER TABLE `transaction`
  MODIFY `tid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pentru tabele `user`
--
ALTER TABLE `user`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constrângeri pentru tabele eliminate
--

--
-- Constrângeri pentru tabele `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `store` (`sid`),
  ADD CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`barcode`) REFERENCES `product` (`barcode`);

--
-- Constrângeri pentru tabele `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  ADD CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`sid`) REFERENCES `store` (`sid`);

--
-- Constrângeri pentru tabele `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`cardno`) REFERENCES `usercard` (`cardno`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
