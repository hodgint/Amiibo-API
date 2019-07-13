-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: localhost    Database: Amiibo
-- ------------------------------------------------------
-- Server version	5.7.22
--
-- Table structure for table `Amiibo`
--


DROP TABLE IF EXISTS `amiibo`;

CREATE TABLE `amiibo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `series` VARCHAR(255) NOT NULL,
  `released` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `nfcTag` VARCHAR(255) NOT NULL,

  PRIMARY KEY (`id`)
);


INSERT INTO amiibo VALUES (1,'Mario', 'Super Smash Brothers', '11/21/2014', 'mariosmash.png','marioSSB.bin');
INSERT INTO amiibo VALUES (2,'peach', 'Super Smash Brothers', '11/21/2014', 'peachsmash.png','peachSSB.bin');
INSERT INTO amiibo VALUES (3,'Yoshi', 'Super Smash Brothers', '11/21/2014', 'yoshismash.png','yoshiSSB.bin');
INSERT INTO amiibo VALUES (4,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (5,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (6,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (7,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (8,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (9,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (10,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (11,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (12,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (13,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (14,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
INSERT INTO amiibo VALUES (15,'Donkey Kong', 'Super Smash Brothers', '11/21/2014', 'dksmash.png','dkSSB.bin');
