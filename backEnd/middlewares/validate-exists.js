const { database } = require('../infrastructure');

const { usersRepository } = require('../repositories');
const { spacesRepository } = require('../repositories');
const { roomsRepository } = require('../repositories');
const { extrasRepository } = require('../repositories');
const { bookingsRepository } = require('../repositories');

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

//Comentario de prueba para rama
module.exports = {
    validateSpace,
    validateRoom,
    validateExtra,
    validateBooking,
    validateExists,
};
