require('dotenv').config();
const path = require('path');
const express = require('express');

const cors = require('cors');

const {
    usersController,
    spacesController,
    roomsController,
    extrasController,
    bookingsController,
    reviewsController,
    incidentsController,
} = require('./controllers');
const { validateAuth, generalValidators } = require('./middlewares/');
const { images } = require('./utils');

const { PORT } = process.env;

const staticPath = path.resolve(__dirname, process.env.UPLOADS_DIRECTORY);

const app = express();
app.use(cors());
app.use(express.json());

//TODO los avatares los quiero en static y que sean públicos??
app.use(express.static(staticPath));

//USERS
//1.1.1-->REGISTRO SE PASA COMPOBACIÓN DE REPETIDAS EN FRONT
app.post('/api/users', usersController.registrer);
//1.1.2-->CONFIRMACION DE USUARIO
app.get('/api/verify/:id_user/:activationCode', usersController.confirmationUser);
//1.2.1-->LOGIN DE USUARIO
app.post('/api/users/login', usersController.login);
//1.2.2-->LOGOUT DE USUARIO
app.post('/api/users/logout', validateAuth.validateAuthorization, usersController.logout);
//1.3.1-ACTUALIZACIÓN DE DATOS DE PERFIL
app.patch(
    '/api/users/:id_user',
    validateAuth.validateAuthorization,
    validateAuth.validateUser,
    usersController.updateProfile
);
//1.3.2-ACTUALIZACIÓN DE AVATAR DEL PERFIL -->POST en vez de PATCH/PUT porque borro el avatar de antes
app.post(
    '/api/users/:id_user/avatar',
    validateAuth.validateAuthorization,
    validateAuth.validateUser,
    images.userAvatar.single('foto'),
    usersController.addAvatar
);
//1.3.4-ACTUALIZACIÓN DE CONTRASEÑA --> SE PASA COMPOBACIÓN DE REPETIDAS EN FRONT
app.patch(
    '/api/users/:id_user/updatePassword',
    validateAuth.validateAuthorization,
    validateAuth.validateUser,
    usersController.updatePassword
);
//TODO check mail exist--> 1.3.5.1-->RECUPERAR CONTRASEÑA PARTE 1 POST--> cambio el codigo auth user aunque sea indirectamente
app.post('/api/recoverPassword', generalValidators.validateEmail, usersController.recoverPassword);
//1.3.5.2-->RECUPERAR CONTRASEÑA PARTE 2
app.patch('/api/recoverPassword/:id_user/:activationCode', usersController.newPassword);
//1.4--> BORRARME COMO USUARIO
app.delete(
    '/api/users/:id_user',
    validateAuth.validateAuthorization,
    validateAuth.validateUser,
    usersController.deleteUser
);
//1.5.1--> VER MI PERFIL
app.get(
    '/api/users/:id_user',
    validateAuth.validateAuthorization,
    validateAuth.validateUser,
    usersController.viewProfileUser
);
//1.5.2--> VER TODOS LOS PERFILES
app.get('/api/users', validateAuth.validateAuthorization, validateAuth.validateAdmin, usersController.getUsers);

//TODO --> Admin borrar todo // Listar usuarios pendientes de pago??

//ESPACIOS
//2.1-->Admin-->crear espacio (Similar a registro de user pero siendo admin)
//TODO --> EXTRA CUANDO ESTÉ FRONT app.post('/api/spaces', validateAuth.validateAuthorization, validateAuth.validateAdmin, spacesController.createSpaces);
//2.2.1-->ADMIN-->modificar espacio
app.patch(
    '/api/spaces/:id_space',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    generalValidators.validateSpace,
    spacesController.updateSpace
);
//2.2.2-->ADMIN Subir Fotos
/*app.post(
    '/api/spaces/:id_space/photos',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    validateAuth.validateSpace,
    helpers.spacePhotos.array('photos'),
    spacesController.setSpacesPhotos
);*/

//2.3.1-->Listar Espacios
app.get('/api/spaces', spacesController.getSpaces);
//2.3.2-->Listar Espacios individuales
app.get('/api/spaces/:id_space', generalValidators.validateSpace, spacesController.viewSpace);
//3-->ADMIN--> borrar espacio
app.delete(
    '/api/spaces/:id_space',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    generalValidators.validateSpace,
    spacesController.deleteSpace
);

//ROOMS
//3.1-->ADMIN-->crear room
//TODO EXTRA app.post('/api/rooms', validateAuth.validateAuthorization, validateAuth.validateAdmin, roomsController.createRooms);
//3.2.1-->ADMIN-->modificar room
app.patch(
    '/api/rooms/:id_room',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    generalValidators.validateRoom,
    roomsController.updateRoom
);
//3.2.2-->ADMIN-->subir fotos
//TODO EXTRA app.post(
/*   '/api/rooms/:id_room/photos',

    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    validateAuth.validateRoom,
    helpers.roomPĥotos.array('photos'),
    roomsController.setRoomsPhotos
);*/

//3.3.1-->Listar rooms de un espacio
app.get('/api/spaces/:id_space/rooms', generalValidators.validateSpace, roomsController.getRoomsBySpace);
//3.3.2-->Listar room individual
app.get('/api/rooms/:id_room', generalValidators.validateRoom, roomsController.viewRoom);
//3.3.3-->Listar room por query params
app.get('/api/prueba/', roomsController.querySeeker);
//3.4-->ADMIN--> borrar room
app.delete(
    '/api/rooms/:id_room',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    generalValidators.validateRoom,
    roomsController.deleteRoom
);

//--> EXTRAS
//4.1-->ADMIN--> CREAR EXTRA
app.post('/api/extras', validateAuth.validateAuthorization, validateAuth.validateAdmin, extrasController.createExtras);
//4.2->ADMIN--> MODIFICAR EXTRA
app.patch(
    '/api/extras/:id_extra',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    generalValidators.validateExtra,
    extrasController.updateExtra
);
//4.3.1 --> VER EXTRAS POR ESPACIO
app.get('/api/spaces/:id_space/extras', generalValidators.validateSpace, extrasController.getExtrasBySpace);
//4.3.2--> VER EXTRAS POR TIPO Y ESPACIO
app.get('/api/spaces/:id_space/extras/:type', generalValidators.validateSpace, extrasController.getExtrasByType);
//4.3.3-->LVER EXTRAS POR ID EXTRA
app.get('/api/extras/:id_extra', generalValidators.validateExtra, extrasController.viewExtra);
//4.4-->ADMIN--> BORRAR EXTRA
app.delete(
    '/api/extras/:id_extra',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    generalValidators.validateExtra,
    extrasController.deleteExtra
);

//RESERVAS
//5.1--> CREAR RESERVA Falta validar bien fechas de devolución
app.post(
    '/api/bookings',
    validateAuth.validateAuthorization,
    validateAuth.validateUserActivate,
    generalValidators.validateRoom,
    bookingsController.createBooking
);
//5.5->PAGAR RESERVA
app.post(
    '/api/bookings/:id_booking',
    validateAuth.validateAuthorization,
    validateAuth.validateUserActivate,
    generalValidators.validateBooking,
    bookingsController.payBooking
);
//5.3.1--> VER MIS RESERVAS // ADMIN -->reservas por usuario --> //TODOañadimos query params?
app.get(
    '/api/users/:id_user/bookings',
    validateAuth.validateAuthorization,
    validateAuth.validateUserActivate,
    bookingsController.getBookingsByUser
);
//5.3.2--> VER RESERVAS POR ESPACIO //TODOañadimos query params?
app.get(
    '/api/bookings/spaces/:id_space',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    bookingsController.getBookingsBySpace
);
//5.3.3-->VER RESERVAS POR SALA //TODOañadimos query params?
app.get(
    '/api/bookings/rooms/:id_room',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    generalValidators.validateRoom,
    bookingsController.getBookingsByRoom
);
//5.4--> BORRAR RESERVASER O ADMIN
app.delete(
    '/api/bookings/:id_booking',
    validateAuth.validateAuthorization,
    validateAuth.validateUserActivate,
    generalValidators.validateBooking,
    bookingsController.deleteBooking
);

// --> RESEÑAS
//6.1--> CREAR RESERÑA
app.post(
    '/api/users/:id_user/bookings/:id_booking/reviews',
    validateAuth.validateAuthorization,
    validateAuth.validateUserActivate,
    generalValidators.validateBooking,
    reviewsController.createReview
);
//6.2.1--> VER RESEÑAS POR USUARIO (admin & user)
app.get(
    '/api/users/:id_user/reviews',
    validateAuth.validateAuthorization,
    validateAuth.validateUserActivate,
    reviewsController.getReviewsByUserId
);
//6.2.2 --> VER TODAS LAS RESEÑAS
app.get(
    '/api/reviews',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    reviewsController.getAllReviews
);
//6.2.3 -> VER RESEÑAS POR ESPACIO
app.get('/api/spaces/:id_space/reviews', generalValidators.validateSpace, reviewsController.getReviewsBySpace);
//6.3 --> BORRAR RESEÑA USER Y/O ADMIN
app.delete(
    '/api/users/:id_user/reviews/:id_review',
    validateAuth.validateAuthorization,
    generalValidators.validateReview,
    reviewsController.deleteReviewById
);

//--> INCIDENCIAS
//7.1--> CREAR INCIDENCIA (user) verificar como en las reseñas que user es propietario de booking
app.post(
    '/api/bookings/:id_booking/incident',
    validateAuth.validateAuthorization,
    validateAuth.validateUserActivate,
    generalValidators.validateBooking,
    incidentsController.createIncident
);
//7.2--> ADMIN-->GESTIONAR INCIDENCIAS (admin)
app.patch(
    '/api/incidents/:id_incident',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    generalValidators.validateIncident,
    incidentsController.closeIncident
);

//7.3.1-> VER INCIDENCIAS POR USUARIO (user || admin--> todas)
app.get('/api/users/:id_user/incidents', validateAuth.validateAuthorization, incidentsController.getIncidentsByUserId);
//7.3.2-->ADMIN--> VER INCIDENCIAS POR ESPACIO
app.get(
    '/api/spaces/:id_space/incidents',
    validateAuth.validateAuthorization,
    validateAuth.validateAdmin,
    generalValidators.validateSpace,
    incidentsController.getIncidentsOpenBySpace
);

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.isJoi ? 400 : err.httpCode || 500;
    res.status(status);
    res.send({ error: err.message });
});

app.listen(PORT, () => console.log(`Coworking project listening at port ${PORT}`));
