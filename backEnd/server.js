require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const {
    usersController,
    spacesController,
    roomsController,
    extrasController,
    bookingsController,
} = require('./controllers');

const {
    validateAuthorization,
    validateUser,
    validateAdmin,
    validateSpace,
    validateRoom,
    validateExtra,
} = require('./middlewares/validate-auth');

const { PORT } = process.env;

const app = express();

app.use(express.json());

//users
//registro
app.post('/api/users', usersController.registrer);
//login
app.post('/api/users/login', usersController.login);
//actualizar datos de perfil (foto/bio)--> añadir tarjeta
app.patch('/api/users/:id_user', validateAuthorization, validateUser, usersController.updateProfile);
//actualizar contraseña
app.patch('/api/users/:id_user/updatePassword', validateAuthorization, validateUser, usersController.updatePassword);
// borrarme como usuario
app.delete('/api/users/:id_user', validateAuthorization, validateUser, usersController.deleteUser);
//ver mi perfil
app.get('/api/users/:id_user', validateAuthorization, validateUser, usersController.viewProfileUser);
//ver perfiles (solo admin)
app.get('/api/users', validateAuthorization, validateAdmin, usersController.getUsers);
//logout
//app.post('/api/users/logout', usersController.logout);

//Actualizar avatar de usuario, POST en vez de PATCH/PUT porque borro el avatar de antes
/*app.post(
    '/users/:id/avatar',
    validateAuthorization,
    uploadImg.uploadUserImg.single('userImg'),
    usersController.updateImage
);*/

//TODO recuperar contraseña
//TODO --> Admin borrar todo // Listar usuarios pendientes de pago??

//ESPACIOS
//Admin crear espacio (Similar a registro de user pero siendo admin)
app.post('/api/spaces', validateAuthorization, validateAdmin, spacesController.createSpaces);
//modificar espacio
app.patch('/api/spaces/:id_space', validateAuthorization, validateAdmin, validateSpace, spacesController.updateSpace);
//Listar Espacios
app.get('/api/spaces', validateAuthorization, validateAdmin, spacesController.getSpaces);
//Listar Espacios individuales
app.get('/api/spaces/:id_space', validateAuthorization, validateAdmin, validateSpace, spacesController.viewSpace);
// borrar espacio
app.delete('/api/spaces/:id_space', validateAuthorization, validateAdmin, validateSpace, spacesController.deleteSpace);

//crear room
app.post('/api/rooms', validateAuthorization, validateAdmin, roomsController.createRooms);
//modificar room
app.patch('/api/rooms/:id_room', validateAuthorization, validateAdmin, validateRoom, roomsController.updateRoom);
//Listar rooms de un espacio
app.get('/api/spaces/:id_space/rooms', validateSpace, roomsController.getRoomsBySpace);
//Listar room individual
app.get('/api/rooms/:id_room', validateRoom, roomsController.viewRoom);
// borrar room
app.delete('/api/rooms/:id_room', validateAuthorization, validateAdmin, validateRoom, roomsController.deleteRoom);

//TODO --> fotos salas???

//TODO --> EXTRAS

//crear extra
app.post('/api/extras', validateAuthorization, validateAdmin, extrasController.createExtras);
//modificar extra
app.patch('/api/extras/:id_extra', validateAuthorization, validateAdmin, validateExtra, extrasController.updateExtra);
//Listar extras de un espacio
app.get('/api/spaces/:id_space/extras', validateSpace, extrasController.getExtrasBySpace);
//Listar extras individuales
app.get('/api/extras/:id_extra', validateExtra, extrasController.viewExtra);
// borrar extra
app.delete('/api/extras/:id_extra', validateAuthorization, validateAdmin, validateExtra, extrasController.deleteExtra);

//TODO -->RESERVAS
//crear reserva --> Falta validar bien fechas + reservas por horas o dias seguidos?
app.post('/api/bookings', validateAuthorization, bookingsController.createBooking);
//TODO --> Modificar reserva
app.patch('/api/bookings/:id_booking', validateAuthorization, bookingsController.updateBooking);
//TODO --> borrar reserva
//TODO --> Ver mis reservas (todas/solo activas)
//TODO --> Ver reservas de todos (activas/realizadas)
//TODO --> Borrar reserva(admin)

//TODO --> INCIDENCIAS
//TODO --> Crear incidencia (user)
//TODO --> Ver incidencias (user || admin--> todas)
//TODO --> Gestionar incidencias (admin)

//TODO --> RESEÑAS
//TODO --> Crear reseña (user) una vez ha finalizado la reserva
//TODO --> ver reseñas creadas (user)
//TODO --> ver todas las reseñas
//TODO --> Borrar mis reseñas
//TODO --> Borrar reseñas

app.use(async (err, req, res, next) => {
    const status = err.isJoi ? 400 : err.code || 500;
    res.status(status);
    res.send({ error: err.message });
});

app.listen(PORT, () => console.log(`Coworking project listening at port ${PORT}`));
