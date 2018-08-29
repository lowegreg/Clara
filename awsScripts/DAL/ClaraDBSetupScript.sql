CREATE TABLE `tableLookUp` (
  `tableId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `lastUpDated` date DEFAULT NULL,
  `defaultTag` varchar(100) DEFAULT NULL,
  `statusId` varchar(50) DEFAULT NULL,
  `submittedBy` varchar(100) DEFAULT NULL,
  `feedback` varchar(500) DEFAULT NULL,
  `submittedOn` date DEFAULT NULL,
  `sourceType` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`tableId`),
  UNIQUE KEY `tableId_UNIQUE` (`tableId`)
) ENGINE=InnoDB AUTO_INCREMENT=319 DEFAULT CHARSET=latin1;
  
  
  CREATE TABLE `propValues` (
  `propId` varchar(50) NOT NULL,
  `displayName` varchar(50) NOT NULL,
  `description` varchar(400) NOT NULL,
  PRIMARY KEY (`propId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

  CREATE TABLE `props` (
  `propId` varchar(50) NOT NULL,
  `tableId` int(11) NOT NULL,
  `dataTypes` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`propId`,`tableId`),
  KEY `tableId_idx` (`tableId`),
  CONSTRAINT `propId` FOREIGN KEY (`propId`) REFERENCES `propValues` (`propId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tableId` FOREIGN KEY (`tableId`) REFERENCES `tableLookUp` (`tableId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `dataTypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) DEFAULT NULL,
  `dataType` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;




CREATE TABLE `notifications` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `receipt` varchar(30) NOT NULL,
  `subTitle` varchar(300) DEFAULT NULL,
  `noteDate` timestamp NULL DEFAULT NULL,
  `title` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

CREATE TABLE `dataTypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) DEFAULT NULL,
  `dataType` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

CREATE TABLE `Weather` (
  `date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `temp` int(11) DEFAULT NULL,
  `pressure` int(11) DEFAULT NULL,
  `humidity` int(11) DEFAULT NULL,
  `tempMin` int(11) DEFAULT NULL,
  `tempMax` int(11) DEFAULT NULL,
  `visibility` int(11) DEFAULT NULL,
  `windSpeed` int(11) DEFAULT NULL,
  `sunRise` datetime DEFAULT NULL,
  `sunSet` datetime DEFAULT NULL,
  `clouds` int(11) DEFAULT NULL,
  `weatherCondition` varchar(255) DEFAULT NULL,
  `weatherDescrip` varchar(255) DEFAULT NULL,
  `icon` int(11) DEFAULT NULL,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Parking Infractions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Date` date DEFAULT NULL,
  `Violation Location` varchar(200) DEFAULT NULL,
  `Violation Description` varchar(200) DEFAULT NULL,
  `Fee` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;





