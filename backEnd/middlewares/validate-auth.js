const jwt = require('jsonwebtoken');
const { database } = require('../infrastructure');

const { usersRepository } = require('../repositories');
const { spacesRepository } = require('../repositories');
const { roomsRepository } = require('../repositories');
const { extrasRepository } = require('../repositories');
const { bookingsRepository } = require('../repositories');

//VALIDADORES DE AUTORIZACION PARA USUARIOS /ADMIN
async function validateAuthorization(req, res, next) {
    try {
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            const error = new Error('Authorization header required');
            error.code = 401;
            throw error;
        }

        const token = authorization.slice(7, authorization.length);
        const decodedToken = jwt.verify(token, process.env.SECRET);

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

async function validateUser(req, res, next) {
    try {
        const { id_user } = req.params;
        const { id } = req.auth;
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
        const { id_space } = req.params;
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
        const { id_room } = req.params;
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
        const { id_extra } = req.params;
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
        const review = await bookingsRepository.getReviewById(id_review);
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
};
