const jwt = require('jsonwebtoken');
const { database } = require('../infrastructure');

//TODO pasar a helper--> organizar validadores y helper
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { nanoid } = require('nanoid');

const { usersRepository } = require('../repositories');
const { spacesRepository } = require('../repositories');
const { roomsRepository } = require('../repositories');
const { extrasRepository } = require('../repositories');
const { bookingsRepository } = require('../repositories');
const { reviewsRepository } = require('../repositories');
const { incidentsRepository } = require('../repositories');
//VALIDADORES DE AUTORIZACION PARA USUARIOS /ADMIN
async function validateAuthorization(req, res, next) {
    try {
        const { authorization } = req.headers;
        const token = authorization.slice(7, authorization.length);
        if (token === 'null') {
            const error = new Error('Authorization header required');
            error.code = 401;
            throw error;
        }
        const decodedToken = jwt.verify(token, process.env.SECRET);

        if (!authorization || !decodedToken.id || !authorization.startsWith('Bearer ')) {
            const error = new Error('Authorization header required');
            error.code = 401;
            throw error;
        }

        const query = 'SELECT * FROM users WHERE id_user= ?';
        const [users] = await database.pool.query(query, decodedToken.id);

        if (!users || !users.length) {
            const error = new Error('El usuario no existe');
            error.code = 401;
            throw error;
        }

        req.auth = decodedToken;
        next();
    } catch (err) {
        next(err);
    }
}

async function validateAdmin(req, res, next) {
    const { role } = req.auth;
    try {
        if (role !== 'admin') {
            const err = new Error('Solo admins');
            err.status = 403;
            throw err;
        }
        next();
    } catch (err) {
        next(err);
    }
}

//Gestion de usuarios
async function validateUser(req, res, next) {
    try {
        const { id_user } = req.params;
        const { id, role } = req.auth;
        const user = await usersRepository.findUserById(id);
        if (!user) {
            const err = new Error('No existe usuario con ese email');
            err.httpCode = 401;
            throw err;
        }

        // Comprobar que el id del parametro y el del usuario que intenta acceder son el mismo
        if (role === 'user' && Number(id_user) !== id) {
            const err = new Error('No tienes permisos para acceder');
            err.httpCode = 403;
            throw err;
        }
        next();
    } catch (err) {
        res.status(err.status || 500);
        res.send({ error: err.message });
    }
}

async function validateSpace(req, res, next) {
    try {
        let { id_space } = req.params;
        if (!id_space) {
            id_space = req.body.id_space;
        }
        const space = await spacesRepository.getSpaceById(id_space);
        if (!space) {
            const err = new Error('No existe este espacio');
            err.httpCode = 401;
            throw err;
        }

        next();
    } catch (err) {
        res.status(err.status || 500);
        res.send({ error: err.message });
    }
}
async function validateRoom(req, res, next) {
    try {
        let { id_room } = req.params;
        if (!id_room) {
            id_room = req.body.id_room;
        }

        const room = await roomsRepository.getRoomById(id_room);
        if (!room) {
            const err = new Error('No existe sala con ese código');
            err.httpCode = 401;
            throw err;
        }

        next();
    } catch (err) {
        res.status(err.status || 500);
        res.send({ error: err.message });
    }
}

async function validateExtra(req, res, next) {
    try {
        let { id_extra } = req.params;
        if (!id_extra) {
            id_extra = req.body.id_extra;
        }
        const extra = await extrasRepository.getExtraById(id_extra);
        if (!extra) {
            const err = new Error('No existe extra con ese código');
            err.httpCode = 401;
            throw err;
        }

        next();
    } catch (err) {
        res.status(err.status || 500);
        res.send({ error: err.message });
    }
}

async function validateBooking(req, res, next) {
    try {
        const { id_booking } = req.params;
        const booking = await bookingsRepository.getBookingById(id_booking);
        if (!booking) {
            const err = new Error('No existe reserva con ese código');
            err.httpCode = 401;
            throw err;
        }

        next();
    } catch (err) {
        res.status(err.status || 500);
        res.send({ error: err.message });
    }
}

async function validateReview(req, res, next) {
    try {
        const { id_review } = req.params;
        const review = await reviewsRepository.getReviewById(id_review);
        if (!review) {
            const err = new Error('No existe review con ese código');
            err.httpCode = 401;
            throw err;
        }

        next();
    } catch (err) {
        res.status(err.status || 500);
        res.send({ error: err.message });
    }
}

async function validateIncident(req, res, next) {
    try {
        const { id_incident } = req.params;
        const incident = await incidentsRepository.getIncidentById(id_incident);
        if (!incident) {
            const err = new Error('La incidencia no existe');
            err.httpCode = 401;
            throw err;
        }

        next();
    } catch (err) {
        res.status(err.status || 500);
        res.send({ error: err.message });
    }
}

////Creamos la ruta al directorio de uploads
//TODO personalizar para cada usuario--> asi solo puede ver cada uno su foto
const uploadsDir = path.join(__dirname, process.env.UPLOADS_DIRECTORY);
async function saveAvatar({ file }) {
    try {
        ////Nos aseguramos de que el directorio existe
        await fs.mkdir(uploadsDir, { recursive: true });

        ////Cargamos la imagen en sharp --> https://github.com/lovell/sharp
        const image = sharp(file.data);

        //TODOModificamos el tamaño de la imagen a un estandar--> ver en webs fotos de avatar
        image.resize(500);

        //TODO webp
        const fileName = `${nanoid(20)}.jpg`;

        //Guardamos la imagen en el directorio de uploadas
        await image.toFile(path.join(uploadsDir, fileName));

        //devolvemos el nombre del fichero
        return fileName;
    } catch (error) {
        throw new Error('Error subiendo imagen');
    }
}

async function deleteAvatar({ file }) {
    const avatarPath = path.join(uploadsDir, file);
    await fs.unlink(avatarPath);
}
//Comentario de prueba para rama
module.exports = {
    validateAuthorization,
    validateUser,
    validateAdmin,
    validateSpace,
    validateRoom,
    validateExtra,
    validateBooking,
    validateReview,
    validateIncident,
    saveAvatar,
    deleteAvatar,
};
