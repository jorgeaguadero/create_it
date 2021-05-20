require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
//const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const {
    usersController,
    spacesController,
    roomsController,
    extrasController,
    bookingsController,
    reviewsController,
    incidentsController,
} = require('./controllers');

const {
    validateAuthorization,
    validateUser,
    validateAdmin,
    validateSpace,
    validateRoom,
    validateExtra,
    validateBooking,
    validateReview,
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
//actualizar contraseña -->
//TODO Comprobar que nueva y vieja no son iguales
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
//TODO todo el mundo puede listar?
app.get('/api/spaces', spacesController.getSpaces);
//Listar Espacios individuales
//TODO todo el mundo puede listar?
app.get('/api/spaces/:id_space', validateSpace, spacesController.viewSpace);
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

//RESERVAS
//crear reserva --> Falta validar bien fechas + reservas por horas o dias seguidos?
app.post('/api/bookings', validateAuthorization, bookingsController.createBooking);
//TODO EXTRA --> Modificar reserva
//app.patch('/api/bookings/:id_booking', validateAuthorization, bookingsController.updateBooking);
////--> borrar reserva
app.delete('/api/bookings/:id_booking', validateAuthorization, validateBooking, bookingsController.deleteBooking);
//TODO --> Ver mis reservas (todas/solo activas)
app.get('/api/users/:id_user/bookings', validateAuthorization, bookingsController.getBookingsByUser);
//TODO --> Ver reservas de todos (activas/realizadas) EXTRA
//// --> Borrar reserva(admin)
app.delete(
    '/api/admin/bookings/:id_booking',
    validateAuthorization,
    validateAdmin,
    validateBooking,
    bookingsController.deleteBooking
);
//TODO Ver reservas por espacio
app.get(
    '/api/admin/bookings/space/:id_space',
    validateAuthorization,
    validateAdmin,

    bookingsController.getBookingsBySpace
),
    ////Ver Reservas por sala
    app.get(
        '/api/admin/bookings/room/:id_room',
        validateAuthorization,
        validateAdmin,
        bookingsController.getBookingsByRoom
    ),
    // --> RESEÑAS
    ////--> Crear reseña (user) una vez ha finalizado la reserva
    //TODO modificar api para ser mas estrictos user-booking revisar
    app.post(
        '/api/users/:id_user/bookings/:id_booking/reviews',
        validateAuthorization,
        validateBooking,
        reviewsController.createReview
    );
////--> ver reseñas creadas por usuario (admin & user)
app.get('/api/users/:id_user/reviews', validateAuthorization, reviewsController.getReviewsByUserId);
//// --> ver todas las reseñas
app.get('/api/reviews', validateAuthorization, validateAdmin, reviewsController.getAllReviews);

//TODO -> ver reseñas por espacio

//TODO --> Borrar reseña user
app.delete(
    '/api/users/:id_user/reviews/:id_review',
    validateAuthorization,
    validateReview,
    reviewsController.deleteReviewById
);
//TODO --> Borrar reseñas

//--> INCIDENCIAS
//TODO --> Crear incidencia (user) verificar como en las reseñas que user es propietario de booking
app.post(
    '/api/users/:id_user/bookings/:id_booking/incident',
    validateAuthorization,
    incidentsController.createIncident
);
//TODO --> Ver incidencias (user || admin--> todas)
app.get('/api/users/:id_user/incidents', validateAuthorization, incidentsController.getIncidentsByUserId);
//TODO --> Gestionar incidencias (admin)
app.patch('/api/incidents/:id_incident', validateAuthorization, validateAdmin, incidentsController.closeIncident);

app.use((err, req, res, next) => {
    const status = err.isJoi ? 400 : err.httpCode || 500;
    res.status(status);
    res.send({ error: err.message });
});

app.listen(PORT, () => console.log(`Coworking project listening at port ${PORT}`));
