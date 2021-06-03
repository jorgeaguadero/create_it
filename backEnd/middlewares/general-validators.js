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
    validateEmail,
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
