DROP DATABASE IF EXISTS create_it;
CREATE DATABASE create_it;
USE create_it;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS auth_codes;
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
    activate boolean not null default 0,
    activation_code VARCHAR(50) NOT NULL,
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
    phone INT NOT NULL,
    modification_date TIMESTAMP
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
    type INT ,
    description VARCHAR(400) NOT NULL,
    price SMALLINT UNSIGNED NOT NULL,
    capacity SMALLINT UNSIGNED ,
    modification_date TIMESTAMP,
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
    type INT,
    extra_code VARCHAR(50) NOT NULL,
    description VARCHAR(50) NOT NULL,
	price SMALLINT UNSIGNED NOT NULL,
    photo varchar(250),
    modification_date TIMESTAMP,
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
        'Pago',
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

insert into users (first_name,last_name, email, passwordHash,phone,role,activate,activation_code) values ('Jorge', 'Aguadero', 'jorgeaguadero@createit.com','$2a$10$uNY2e/48xjzjnZR9Vs5k6erkdOU9O9P0VrCSsYfglPdASCDwd46pa',666152053,'admin',1,'asdfafwefawef');
insert into users (first_name,last_name, email, passwordHash,activate,activation_code ) values ('Prueba2', 'Probando', 'prueba2@createit.com','$2a$10$uNY2e/48xjzjnZR9Vs5k6erkdOU9O9P0VrCSsYfglPdASCDwd46pa',1,'asdfafwefawef');
insert into users (first_name,last_name, email, passwordHash,activate,activation_code,pending_payment ) values ('Prueba3', 'pendientePago', 'prueba3@createit.com','$2a$10$uNY2e/48xjzjnZR9Vs5k6erkdOU9O9P0VrCSsYfglPdASCDwd46pa',1,'asdfafwefawef',1);

insert into spaces (id_user,space_name, description, location,address,email,phone ) values (1, "Arcane Planet", 'Salas de Ensayo y estudio de grabación en el centro de salamanca, contamos con salas de ensayo para grupos e individuales y también con dos salas para audiovisuales','Salamanca','Calle Mallorca 16,37006,Salamanca','arcaneplanet@createit.com',666112233 );
insert into spaces (id_user,space_name, description, location,address,email,phone ) values (1, "Arcane Cotton Club", 'Salas de Ensayo y estudio de grabación en el polígono del Montalvo (Salamanca), contamos con salas de ensayo para grupos e individuales y también con una sala para audiovisuales','Calle Wesley,9,37188,Carbajosa de la Sagrada,Salamanca','cottonclub@createit.com',666223344 );
insert into spaces (id_user,space_name, description, location,address,email,phone ) values (1, "El Bunker", 'Alquiler de salas de esayo, estudio, y salas de audiovisuales en el pleno centro de León','Calle Maestro Nicolás 58,24005, León','elbunker@createit.com',666334455 );

insert into rooms (id_space,room_code,type,description,price,capacity) values (1, "ARCGRU01",1, 'Sala grupal 1',20,10 );
insert into rooms (id_space,room_code,type,description,price,capacity) values (1, "ARCGRU02",1, 'Sala grupal 2',20,10 );
insert into rooms (id_space,room_code,type,description,price,capacity) values (1, "ARCGRU03", 1,'Sala grupal 3',20,10 );
insert into rooms (id_space,room_code,description,price,capacity) values (1, "ARCIND01", 'Sala individual 1',10,2 );
insert into rooms (id_space,room_code,description,price,capacity) values (1, "ARCIND02", 'Sala individual 1',10,2 );
insert into rooms (id_space,room_code,type,description,price,capacity) values (1, "ARCAUV01",2,'Sala de audiovisuales 1',20,10);
insert into rooms (id_space,room_code,type,description,price,capacity) values (1, "ARCAUV02", 2,'Sala de audiovisuales 1',40,20);
insert into rooms (id_space,room_code,type,description,price,capacity) values (1, "ARCSTU01",3, 'Estudio de grabación 1',200,20 );
insert into rooms (id_space,room_code,type,description,price,capacity) values (2, "COTGRU01",1, 'Sala grupal 1',20,10  );
insert into rooms (id_space,room_code,type,description,price,capacity) values (2, "COTGRU02", 1,'Sala grupal 2',40,15 );
insert into rooms (id_space,room_code,type,description,price,capacity) values (2, "COTAUV01",2, 'Sala de audiovisuales',20,10  );
insert into rooms (id_space,room_code,description,price,capacity) values (2, "COTIND01", 'Sala individual 1',10,2 );
insert into rooms (id_space,room_code,description,price,capacity) values (2, "COTIND02", 'Sala individual 2',10,2 );
insert into rooms (id_space,room_code,type,description,price,capacity) values (2, "COTLIV01",3, 'Sala de conciertos',200,300 );
insert into rooms (id_space,room_code,type,description,price,capacity) values (3, "BUNGRU01",1, 'Sala grupal 1',20,10  );
insert into rooms (id_space,room_code,type,description,price,capacity) values (3, "BUNGRU02",1, 'Sala grupal 2',20,10  );
insert into rooms (id_space,room_code,type,description,price,capacity) values (3, "BUNGRU03", 1,'Sala grupal 3',20,10  );
insert into rooms (id_space,room_code,description,price,capacity) values (3, "BUNIND01", 'Sala individual 1',10,2 );
insert into rooms (id_space,room_code,description,price,capacity) values (3, "BUNIND02", 'Sala individual 2',10,2 );
insert into rooms (id_space,room_code,type,description,price,capacity) values (3, "BUNAUV01", 2,'Sala de audiovisuales',20,10 );
insert into rooms (id_space,room_code,type,description,price,capacity) values (3, "BUNLIV01", 3,'Sala de conciertos',200,300 );



insert into extras (id_space,extra_code,type,description,price) values (1, "ARCBCK01", 1, 'backline completo',10);
insert into extras (id_space,extra_code,type,description,price) values (1, "ARCBCK02", 1, 'backline completo',10 );
insert into extras (id_space,extra_code,type,description,price) values (1, "ARCBCK03", 1, 'juego de voces',5 );
insert into extras (id_space,extra_code,type,description,price) values (1, "ARCAUD01", 2, 'Pack 2 focos + Chroma',10 );
insert into extras (id_space,extra_code,type,description,price) values (1, "ARCTCH01", 3, 'técnico de sonido',5 );
insert into extras (id_space,extra_code,type,description,price) values (2, "ARCBCK01", 1, 'backline completo',10);
insert into extras (id_space,extra_code,type,description,price) values (2, "ARCBCK02", 1, 'backline completo',10 );
insert into extras (id_space,extra_code,type,description,price) values (2, "ARCBCK03", 1, 'juego de voces',5 );
insert into extras (id_space,extra_code,type,description,price) values (2, "ARCAUD01", 2, 'Pack 2 focos + Chroma',10 );
insert into extras (id_space,extra_code,type,description,price) values (2, "ARCTCH01", 3, 'técnico de sonido',5 );
insert into extras (id_space,extra_code,type,description,price) values (3, "ARCBCK01", 1, 'backline completo',10);
insert into extras (id_space,extra_code,type,description,price) values (3, "ARCBCK02", 1, 'backline completo',10 );
insert into extras (id_space,extra_code,type,description,price) values (3, "ARCBCK03", 1, 'juego de voces',5 );
insert into extras (id_space,extra_code,type,description,price) values (3, "ARCAUD01", 2, 'Pack 2 focos + Chroma',10 );
insert into extras (id_space,extra_code,type,description,price) values (3, "ARCTCH01", 3, 'técnico de sonido',5 );

insert into bookings (id_user,id_space,id_room,start_date,price) values(2,1,1,'2021-06-27 23:30:45',20);
insert into bookings (id_user,id_space,id_room,start_date,price) values(2,1,1,'2021-02-01',20);
insert into bookings (id_user,id_space,id_room,start_date,price) values(2,1,1,'2021-01-01',20);
insert into bookings (id_user,id_space,id_room,start_date,price) values(2,1,1,'2021-03-01',20);
insert into bookings (id_user,id_space,id_room,start_date,price) values(2,1,1,'2021-04-01',20);
insert into bookings (id_user,id_space,id_room,start_date,price) values(2,1,2,'2021-06-27 23:30:45',20);

select * from bookings where id_user=2;

select * from bookings ;

select * from users ;
delete from users where id_user=6;


