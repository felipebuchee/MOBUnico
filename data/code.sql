CREATE DATABASE minecraft_db;

USE minecraft_db;

CREATE TABLE mobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    tipo VARCHAR(1) NOT NULL,
    dificuldade VARCHAR(1) NOT NULL,
    versao VARCHAR(10) NOT NULL,
    imagem VARCHAR(500) NOT NULL
);