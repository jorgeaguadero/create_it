const jwt = require('jsonwebtoken');
const { database } = require('../infrastructure');

//TODO pasar a helper--> organizar validadores y helper
const {
    usersRepository,
    spacesRepository,
    roomsRepository,
    extrasRepository,
    bookingsRepository,
    reviewsRepository,
    incidentsRepository,
} = require('../repositories');

//VALIDADORES DE AUTORIZACION PARA USUARIOS /ADMIN
async function validateAuthorization(req, res, next) {
    try {
        const { authorization } = req.headers;
        const { id_user } = req.params;

        const token = authorization.slice(7, authorization.length);
        if (token === 'null') {
            const error = new Error('Es necesario estar logueado');
            error.code = 401;
            throw error;
        }
        const decodedToken = jwt.verify(token, process.env.SECRET);

        if (!authorization || !decodedToken.id || !authorization.startsWith('Bearer ')) {
            const error = new Error('Es necesario estar logueado');
            error.code = 401;
            throw error;
        }

        const query = `SELECT * FROM users WHERE id_user=${decodedToken.id} `;
        const [users] = await database.pool.query(query);

        //caso muy remoto en el que el id del token ya no esté en base de datos
        if (!users || !users.length) {
            const error = new Error('El usuario logueado ya no se encuentra en nuestra base de datos');
            error.code = 401;
            throw error;
        }
        req.auth = decodedToken;
        if (id_user) {
            if (req.auth.role === 'user' && Number(id_user) !== req.auth.id) {
                const err = new Error('No tienes permisos para acceder');
                err.httpCode = 403;
                throw err;
            }
        }

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
        let { id_user } = req.params;
        if (!id_user) {
            id_user = req.body.id_user;
        }
        const user = await usersRepository.getUserById(id_user);
        if (!user) {
            const err = new Error('No existe este usuario');
            err.httpCode = 401;
            throw err;
        }

        //se podria meter user en res??
        next();
    } catch (err) {
        next(err);
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

async function validateEmail(req, res, next) {
    try {
        let { email } = req.params;
        if (!email) {
            email = req.body.email;
        }
        const user = await usersRepository.getUserByEmail(email);
        if (!user) {
            const err = new Error('No existe usuario con este mail');
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

module.exports = {
    validateAuthorization,
    validateEmail,
    validateUser,
    validateAdmin,
    validateSpace,
    validateRoom,
    validateExtra,
    validateBooking,
    validateReview,
    validateIncident,
};

//TODO logica para validador general
/*async function validateExists(req, res, next) {
    try {
        const identifiers = req.params;
        const ifItemExist = async (id) => {

              const item_table = {
                  id_space: 'spaces',
                  id_room: 'rooms',
                  id_extra: 'extras',
                  id_booking: 'bookings',
                  id_indicent: 'incidents',
                  id_review: 'reviews',
              };

        if (value !== undefined && row !== 'role') {
            const query = `UPDATE users SET ${row} = '${value}' WHERE id_user = '${id_user}'`;
            await database.pool.query(query);
        }
    };

    for (const id in idenfifiers) await ifItemExist(id, identifiers[id]);

        next();
    } catch (err) {
        res.status(err.status || 500);
        res.send({ error: err.message });
    }
}*/
