CREATE DATABASE  IF NOT EXISTS `boards` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `boards`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: boards
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `board_owners`
--

DROP TABLE IF EXISTS `board_owners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `board_owners` (
  `boardId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  UNIQUE KEY `board_composite_idx` (`userId`,`boardId`),
  KEY `board_id_idx` (`boardId`),
  KEY `fk_board_owner_userid_idx` (`userId`),
  KEY `board_usrid_idx` (`userId`),
  CONSTRAINT `fk_board_owner_boardid` FOREIGN KEY (`boardId`) REFERENCES `boards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_board_owner_userid` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board_owners`
--

LOCK TABLES `board_owners` WRITE;
/*!40000 ALTER TABLE `board_owners` DISABLE KEYS */;
INSERT INTO `board_owners` VALUES (16,2,'2017-09-22 21:02:37','2017-09-22 21:02:37'),(18,2,'2017-10-04 10:59:37','2017-10-04 10:59:37'),(20,2,'2017-10-04 22:45:37','2017-10-04 22:45:37');
/*!40000 ALTER TABLE `board_owners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boards`
--

DROP TABLE IF EXISTS `boards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `boards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `deleted` (`deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boards`
--

LOCK TABLES `boards` WRITE;
/*!40000 ALTER TABLE `boards` DISABLE KEYS */;
INSERT INTO `boards` VALUES (16,'board1',0,'2017-09-22 21:02:37','2017-10-04 10:35:00'),(18,'board2',0,'2017-10-04 10:59:37','2017-10-04 11:14:52'),(20,'board3',0,'2017-10-04 22:45:37','2017-10-04 22:45:37');
/*!40000 ALTER TABLE `boards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `note_tags`
--

DROP TABLE IF EXISTS `note_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `note_tags` (
  `noteId` int(11) NOT NULL,
  `tagId` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  KEY `fk_note_tags_tagId_idx` (`tagId`),
  KEY `fk_note_tags_noteId_idx` (`noteId`),
  CONSTRAINT `fk_note_tags_noteId` FOREIGN KEY (`noteId`) REFERENCES `notes` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_note_tags_tagId` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `note_tags`
--

LOCK TABLES `note_tags` WRITE;
/*!40000 ALTER TABLE `note_tags` DISABLE KEYS */;
INSERT INTO `note_tags` VALUES (63,8,'2017-10-04 22:44:55','2017-10-04 22:44:55'),(63,9,'2017-10-04 22:44:55','2017-10-04 22:44:55'),(62,7,'2017-10-04 22:45:57','2017-10-04 22:45:57');
/*!40000 ALTER TABLE `note_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `boardId` int(11) NOT NULL,
  `title` varchar(45) COLLATE utf8mb4_bin DEFAULT NULL,
  `content` blob,
  `colour` varchar(6) COLLATE utf8mb4_bin DEFAULT NULL,
  `archived` tinyint(4) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_board_idx` (`boardId`),
  KEY `archived` (`archived`),
  CONSTRAINT `fk_notes_boardId` FOREIGN KEY (`boardId`) REFERENCES `boards` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (59,16,'note1','note1','80deea',0,'2017-09-30 17:53:20','2017-10-04 23:19:52'),(62,18,'note2','note2','ffffff',0,'2017-10-04 21:20:56','2017-10-04 23:19:53'),(63,20,'note3','note3','ef9a9a',0,'2017-10-04 22:44:55','2017-10-04 23:19:53');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(69) COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`name`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'testTag1','2017-07-04 00:00:00','2017-07-04 00:00:00'),(3,'testTag12','2017-07-04 23:41:43','2017-07-04 23:41:43'),(4,'testTag13','2017-07-04 23:42:55','2017-07-04 23:42:55'),(5,'testTag14','2017-07-04 23:43:20','2017-07-04 23:43:20'),(6,'testTag15','2017-07-04 23:44:40','2017-07-04 23:44:40'),(7,'tag1','2017-09-03 20:53:49','2017-09-21 08:22:05'),(8,'tag2','2017-09-13 16:24:18','2017-09-13 16:24:18'),(9,'tag3','2017-10-04 20:46:40','2017-10-04 20:46:40');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tags`
--

DROP TABLE IF EXISTS `user_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_tags` (
  `userId` int(11) NOT NULL,
  `tagId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  KEY `ix_user_tag_userid` (`userId`),
  KEY `fk_user_tags_tagId_idx` (`tagId`),
  CONSTRAINT `fk_user_tags_tagId` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_tags_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tags`
--

LOCK TABLES `user_tags` WRITE;
/*!40000 ALTER TABLE `user_tags` DISABLE KEYS */;
INSERT INTO `user_tags` VALUES (2,7,'2017-09-03 20:53:03','2017-09-03 20:53:03'),(2,8,'2017-09-13 16:24:18','2017-09-13 16:24:18'),(2,9,'2017-10-04 20:46:40','2017-10-04 20:46:40');
/*!40000 ALTER TABLE `user_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('devUser1',1,NULL,NULL),('devUser2',2,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-05  9:23:24
