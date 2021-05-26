require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

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

const {
    validateAuthorization,
    validateUser,
    validateAdmin,
    validateSpace,
    validateRoom,
    validateExtra,
    validateBooking,
    validateReview,
    validateIncident,
} = require('./middlewares/validate-auth');

const { validateAuth } = require('./middlewares');
const { PORT } = process.env;

const staticPath = path.resolve(__dirname, 'static');
//TODO extraer??--> avatar --> fileupload+ sharp
const userAvatar = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id_user } = req.params;
            const folder = path.join(__dirname, `static/users/${id_user}/`);
            fs.mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 1024 * 1024, // 1 MB
    },
});

const spacePhotos = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id_space } = req.params;
            const folder = path.join(__dirname, `static/spaces/${id_space}/`);
            fs.mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 1024 * 1024, // 1 MB
    },
});

const roomPĥotos = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id_room } = req.params;
            const folder = path.join(__dirname, `static/rooms/${id_room}/`);
            fs.mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 1024 * 1024, // 1 MB
    },
});

const app = express();
//app.use(cors());
app.use(express.json());

app.use(express.static(staticPath));

//users -->>ok
//registro
app.post('/api/users', usersController.registrer);
//login
app.post('/api/users/login', usersController.login);
// logout
app.post('/api/users/:id_user/logout', validateAuthorization, validateUser, usersController.logout);
//TODO actualizar datos de perfil (foto/bio)--> en update dividir entre avatar y datos
app.patch('/api/users/:id_user', validateAuthorization, validateUser, usersController.updateProfile);
//actualizar contraseña -->
app.patch('/api/users/:id_user/updatePassword', validateAuthorization, validateUser, usersController.updatePassword);
// borrarme como usuario
app.delete('/api/users/:id_user', validateAuthorization, validateUser, usersController.deleteUser);
//ver mi perfil
app.get('/api/users/:id_user', validateAuthorization, validateUser, usersController.viewProfileUser);
//ver perfiles (solo admin)
app.get('/api/users', validateAuthorization, validateAdmin, usersController.getUsers);
//logout
app.post('/api/users/logout', usersController.logout);

//Actualizar avatar de usuario, POST en vez de PATCH/PUT porque borro el avatar de antes
app.post(
    '/api/users/:id_user/avatar',
    validateAuthorization,
    validateUser,
    userAvatar.single('avatar'),
    usersController.updateAvatar
);

//TODO --> Admin borrar todo // Listar usuarios pendientes de pago??

//ESPACIOS
//Admin crear espacio (Similar a registro de user pero siendo admin)
app.post('/api/spaces', validateAuthorization, validateAdmin, spacesController.createSpaces);
//Subir Fotos
app.post(
    '/api/spaces/:id_space/photos',
    validateAuthorization,
    validateAdmin,
    validateSpace,
    spacePhotos.array('photos'),
    spacesController.setSpacesPhotos
);
//modificar espacio
app.patch('/api/spaces/:id_space', validateAuthorization, validateAdmin, validateSpace, spacesController.updateSpace);
//Listar Espacios
app.get('/api/spaces', spacesController.getSpaces);
//Listar Espacios individuales
app.get('/api/spaces/:id_space', validateSpace, spacesController.viewSpace);
// borrar espacio
app.delete('/api/spaces/:id_space', validateAuthorization, validateAdmin, validateSpace, spacesController.deleteSpace);
//ROOMS
//TODO pagos pendientes
//crear room
app.post('/api/rooms', validateAuthorization, validateAdmin, roomsController.createRooms);
//subir fotos
app.post(
    '/api/rooms/:id_room/photos',
    validateAuthorization,
    validateAdmin,
    validateRoom,
    roomPĥotos.array('photos'),
    roomsController.setRoomsPhotos
);
//modificar room
app.patch('/api/rooms/:id_room', validateAuthorization, validateAdmin, validateRoom, roomsController.updateRoom);
//Listar rooms de un espacio
app.get('/api/spaces/:id_space/rooms', validateSpace, roomsController.getRoomsBySpace);
//Listar room individual
app.get('/api/rooms/:id_room', validateRoom, roomsController.viewRoom);
//Listar room por query params
app.get('/api/prueba/', roomsController.querySeeker);
// borrar room
app.delete('/api/rooms/:id_room', validateAuthorization, validateAdmin, validateRoom, roomsController.deleteRoom);

//--> EXTRAS
//crear extra
app.post('/api/extras', validateAuthorization, validateAdmin, extrasController.createExtras);
//modificar extra
app.patch('/api/extras/:id_extra', validateAuthorization, validateAdmin, validateExtra, extrasController.updateExtra);
// borrar extra
app.delete('/api/extras/:id_extra', validateAuthorization, validateAdmin, validateExtra, extrasController.deleteExtra);
//Listar extras de un espacio
app.get('/api/spaces/:id_space/extras', validateSpace, extrasController.getExtrasBySpace);
//Listar extras individuales
app.get('/api/extras/:id_extra', validateExtra, extrasController.viewExtra);

//RESERVAS
//crear reserva --> Falta validar bien fechas de devolución
app.post('/api/bookings', validateAuthorization, validateRoom, validateExtra, bookingsController.createBooking);
////Pagar reserva
app.post('/api/bookings/:id_booking', validateAuthorization, validateBooking, bookingsController.payBooking);
////--> borrar reserva +Borrar reserva(admin)
app.delete('/api/bookings/:id_booking', validateAuthorization, validateBooking, bookingsController.deleteBooking);
//// --> Ver mis reservas // Admin -->reservas por usuario --> //TODOañadimos query params?
app.get('/api/users/:id_user/bookings', validateAuthorization, bookingsController.getBookingsByUser);
////--> Ver Todas por espacio //TODOañadimos query params?
app.get('/api/users/:id_user/bookings', validateAuthorization, validateAdmin, bookingsController.getBookingsBySpace);
////--> Ver Todas por sala //TODOañadimos query params?
app.get('/api/users/:id_user/bookings', validateAuthorization, validateAdmin, bookingsController.getBookingsByRoom);

// --> RESEÑAS
////--> Crear reseña (user) una vez ha finalizado la reserva
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
//// -> ver reseñas por espacio
app.get('/api/spaces/:id_space/reviews', validateAuthorization, validateSpace, reviewsController.getReviewsBySpace);
//// --> Borrar reseña user y/o Admin
app.delete(
    '/api/users/:id_user/reviews/:id_review',
    validateAuthorization,
    validateReview,
    reviewsController.deleteReviewById
);

//--> INCIDENCIAS
////--> Crear incidencia (user) verificar como en las reseñas que user es propietario de booking
app.post(
    '/api/bookings/:id_booking/incident',
    validateAuthorization,
    validateBooking,
    incidentsController.createIncident
);
////--> Gestionar incidencias (admin)
app.patch(
    '/api/incidents/:id_incident',
    validateAuthorization,
    validateAdmin,
    validateIncident,
    incidentsController.closeIncident
);

////--> Ver incidencias (user || admin--> todas)
app.get('/api/users/:id_user/incidents', validateAuthorization, incidentsController.getIncidentsByUserId);
////--> Ver incidencias (user || admin--> todas)
app.get(
    '/api/spaces/:id_space/incidents',
    validateAuthorization,
    validateAdmin,
    validateSpace,
    incidentsController.getIncidentsOpenBySpace
);

app.use((err, req, res, next) => {
    const status = err.isJoi ? 400 : err.httpCode || 500;
    res.status(status);
    res.send({ error: err.message });
});

app.listen(PORT, () => console.log(`Coworking project listening at port ${PORT}`));
