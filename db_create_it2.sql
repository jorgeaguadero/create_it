DROP DATABASE IF EXISTS create_it;
CREATE DATABASE create_it;
USE create_it;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS spaces;
DROP TABLE IF EXISTS rooms_photo;
DROP TABLE IF EXISTS spaces_photo;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS extras;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS incidents;
CREATE TABLE users (
    id_user INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(512) NOT NULL,
    phone VARCHAR(30) UNIQUE,
    bio VARCHAR(200),
    avatar VARCHAR(250),
    role VARCHAR(50) DEFAULT 'user',
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    validate boolean not null default 0,
    pending_payment boolean not null default 0
);
CREATE TABLE spaces (
    id_space INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_user INT NOT NULL,
    space_name VARCHAR(50) NOT NULL,
    description VARCHAR(400) NOT NULL,
    location varchar(100) NOT NULL,
    address varchar(250) NOT NULL,
    email varchar(50) NOT NULL,
    phone INT NOT NULL
);
CREATE TABLE spaces_photo (
    id_space_Photo INT AUTO_INCREMENT PRIMARY KEY,
    id_space INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    url VARCHAR(250) UNIQUE NOT NULL,
	CONSTRAINT fk_spaces_photo FOREIGN KEY (id_space) REFERENCES spaces (id_space) ON DELETE CASCADE
);
CREATE TABLE rooms (
    id_room INT PRIMARY KEY AUTO_INCREMENT,
    id_space INT NOT NULL,
    room_code VARCHAR (50) NOT NULL,
    description VARCHAR(400) NOT NULL,
    price SMALLINT UNSIGNED NOT NULL,
    capacity SMALLINT UNSIGNED NOT NULL,
    availability boolean NOt NULL default 0,
    CONSTRAINT fk_space_room FOREIGN KEY (id_space) REFERENCES spaces (id_space) ON DELETE CASCADE
);
CREATE TABLE rooms_photo (
    id_room_photo INT AUTO_INCREMENT PRIMARY KEY,
    id_room INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    url VARCHAR(250) UNIQUE NOT NULL,
    CONSTRAINT fk_photo_space FOREIGN KEY (id_room) REFERENCES rooms (id_room) ON DELETE CASCADE 
);
CREATE TABLE extras (
    id_extra INT PRIMARY KEY AUTO_INCREMENT,
    id_space INT NOT NULL,
    extra_code VARCHAR(50) NOT NULL,
    description VARCHAR(50) NOT NULL,
	price SMALLINT UNSIGNED NOT NULL,
    CONSTRAINT fk_extra_space FOREIGN KEY (id_space) REFERENCES spaces (id_space) ON DELETE CASCADE
);
CREATE TABLE bookings (
    id_booking INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_space INT NOT NULL,
    id_room INT NOT NULL,
    id_extra INT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    price INT UNSIGNED NOT NULL,
    review boolean NOT NULL default 0,
    pending_payment boolean NOT NULL default 1,
    CONSTRAINT fk_booking_user FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE,
    CONSTRAINT fk_booking_room FOREIGN KEY (id_room) REFERENCES rooms (id_room)ON DELETE CASCADE
);
CREATE TABLE incidents (
    id_incident INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_space INT NOT NULL,
    id_booking INT NOT NULL,
    incident_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_date TIMESTAMP,
    type ENUM(
        'Limpieza',
        'pago',
        'Wifi',
        'Aclimatación',
        'Iluminación',
        'Equipo'
    ) NOT NULL,
    description VARCHAR(500) NOT NULL,
    state boolean NOT NULL default 0,
    CONSTRAINT fk_incident_user FOREIGN KEY (id_user) REFERENCES users (id_user) ,
     CONSTRAINT fk_incident_space FOREIGN KEY (id_space) REFERENCES spaces (id_space) ,
    CONSTRAINT fk_incident_booking FOREIGN KEY (id_booking) REFERENCES bookings (id_booking) 
);
CREATE TABLE reviews (
    id_review INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_space INT NOT NULL,
    id_booking INT NOT NULL,
    review_date TIMESTAMP,
    rating INT NOT NULL,
    text VARCHAR(500) NOT NULL,
    CONSTRAINT fk_review_user FOREIGN KEY (id_user) REFERENCES users (id_user) ,
    CONSTRAINT fk_review_space FOREIGN KEY (id_space) REFERENCES spaces (id_space) ,
    CONSTRAINT fk_review_booking FOREIGN KEY (id_booking) REFERENCES bookings (id_booking) 
);

insert into users (first_name,last_name, email, passwordHash,phone,role ) values ('Jorge', 'Aguadero', 'jorgeaguadero@createit.com','$2a$10$uNY2e/48xjzjnZR9Vs5k6erkdOU9O9P0VrCSsYfglPdASCDwd46pa',666152053,'admin');
insert into users (first_name,last_name, email, passwordHash ) values ('Prueba1', 'Probando', 'prueba1@createit.com','$2a$10$uNY2e/48xjzjnZR9Vs5k6erkdOU9O9P0VrCSsYfglPdASCDwd46pa');

insert into spaces (id_user,space_name, description, location,address,email,phone ) values (1, "El Bunker", 'Locales y sala de conciertos en leon','León','Calle tiriri','elbunker@createit.com',123456789 );
insert into rooms (id_space,room_code,description,price,capacity) values (1, "BUNGRU01", 'Sala grupal 1',20,5 );
insert into extras (id_space,extra_code,description,price) values (1, "PACK001", 'backline1',5 );
insert into bookings (id_user,id_space,id_room,start_date,price) values(2,1,1,current_timestamp(),20);
insert into bookings (id_user,id_space,id_room,start_date,price) values(2,1,1,'2021-01-01',20);

