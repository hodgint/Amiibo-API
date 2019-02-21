-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: localhost    Database: Amiibo
-- ------------------------------------------------------
-- Server version	5.7.22
--
-- Table structure for table `Amiibo`
--


DROP TABLE IF EXISTS `Amiibo`;

CREATE DATABASE amiiboapi;

USE amiiboapi

CREATE TABLE `Amiibo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  'series' VARCHAR(255) NOT NULL,
  'released' VARCHAR(255) NOT NULL,
  'image' VARCHAR(255) NOT NULL,

  PRIMARY KEY (`id`)
);
