const Joi = require('joi');
const { sendMails } = require('../utils/');

//TODO VALIDATE USER PASARLO A MIDDLEWARE Y ASI ADMIN PUEDE TENER PERMISOS EXTRA
const { bookingsRepository } = require('../repositories');
const { usersRepository } = require('../repositories');
const { validateAuth } = require('../middlewares');
const { ValidateDate } = require('../utils');
//const { sendMails } = require('../utils');

//5.1-->CREAR RESERVA
async function createBooking(req, res, next) {
    try {
        const { id } = req.auth;
        const { id_room, id_extra, start_date } = req.body;

        const schema = Joi.object({
            id_room: Joi.number().required(),
            id_extra: Joi.number(),
            start_date: Joi.date().required(),
        });

        await schema.validateAsync({
            id_room,
            id_extra,
            start_date,
        });

        if (!ValidateDate.isBeforeDate(start_date)) {
            const error = new Error('la fecha tiene que ser posterior a hoy');
            throw error;
        }

        const infoRoom = await bookingsRepository.getRoomInfo(start_date, id_room);
        const user = await usersRepository.getUserById(id);

        if (!id_extra) {
            const booking = await bookingsRepository.createBooking(
                id,
                infoRoom.id_space,
                id_room,
                start_date,
                infoRoom.price
            );
            res.status(201);
            await sendMails.sendMail({
                to: user.email,
                subject: 'Confirmación de Reserva || Create It',
                body: `¡Te confirmamos la reserva que has realizado para el dia ${start_date} de la sala ${booking.id_room} por un total de ${booking.price}!  http://localhost:3000 `,
            });
            res.send(booking);
        } else {
            const infoExtra = await bookingsRepository.getExtraInfo(start_date, id_extra, infoRoom.id_space);
            //me devuelve la fecha con una hora menos-->un dia menos formateo a ISO
            if (infoRoom.type !== infoExtra.type) {
                const error = new Error('no puedes coger este extra');
                throw error;
            }
            const totalPrice = infoRoom.price + infoExtra.price;
            const booking = await bookingsRepository.createBookingWithExtra(
                id,
                infoRoom.id_space,
                id_room,
                id_extra,
                start_date,
                totalPrice
            );
            //const fechaBien = formatISO(booking.start_date, { representation: 'date' });
            res.status(201);
            await sendMails.sendMail({
                to: user.email,
                subject: 'Confirmación de Reserva || Create It',
                body: `¡Te confirmamos la reserva que has realizado para el dia ${start_date} de la sala ${booking.id_room} por un total de ${booking.price}!  http://localhost:3000 `,
            });
            res.send({ booking });
        }
    } catch (err) {
        next(err);
    }
}

//5.2-->PAGAR RESERVA
async function payBooking(req, res, next) {
    try {
        const { id_booking } = req.params;
        const { id } = req.auth;

        let booking = await bookingsRepository.getBookingById(id_booking);
        let user = await usersRepository.getUserById(id);

        validateAuth.validateProperty(req, booking);

        if (booking.pending_payment === 0) {
            const error = new Error('ya está pagado');
            throw error;
        }

        const result = await bookingsRepository.payBooking(id_booking, id);
        res.status(201);
        await sendMails.sendMail({
            to: user.email,
            subject: 'Confirmación de pago de tu reserva|| Create It',
            body: `¡Te confirmamos el pago de tu reserva ${id_booking}!  http://localhost:3000 `,
        });
        res.send(result);
    } catch (error) {
        next(error);
    }
}

//5.3.1-->VER RESERVA POR USUARIO
async function getBookingsByUser(req, res, next) {
    try {
        const { id_user } = req.params;
        validateAuth.validateProperty(req, req.params);

        const bookings = await bookingsRepository.getBookingsByUser(id_user);

        res.send(bookings);
    } catch (err) {
        next(err);
    }
}
async function getBookingById(req, res, next) {
    try {
        const { id_booking } = req.params;
        const booking = await bookingsRepository.getBookingById(id_booking);
        validateAuth.validateProperty(req, booking);

        res.send(booking);
    } catch (err) {
        next(err);
    }
}
//5.3.1.2-->VER RESERVA POR USUARIO COMPLETA
async function getBookingsCompletedByUser(req, res, next) {
    try {
        const { id_user } = req.params;
        validateAuth.validateProperty(req, req.params);

        const bookings = await bookingsRepository.getBookingsCompletedByUser(id_user);

        res.send(bookings);
    } catch (err) {
        next(err);
    }
}

async function getActiveBookingsByUser(req, res, next) {
    try {
        const { id_user } = req.params;
        validateAuth.validateProperty(req, req.params);

        const bookings = await bookingsRepository.getActiveBookingsByUser(id_user);

        res.send(bookings);
    } catch (err) {
        next(err);
    }
}

async function getAllActiveBookingsBySpace(req, res, next) {
    try {
        const { id_space } = req.params;
        const bookings = await bookingsRepository.getAllActiveBookingsBySpace(id_space);

        res.send(bookings);
    } catch (err) {
        next(err);
    }
}

//5.3.2-->VER RESERVA POR ESPACIO
async function getBookingsBySpace(req, res, next) {
    try {
        const { id_space } = req.params;
        const bookings = await bookingsRepository.getBookingsBySpace(id_space);

        res.send(bookings);
    } catch (err) {
        next(err);
    }
}

//5.3.3-->VER RESERVA POR SALA
async function getBookingsByRoom(req, res, next) {
    try {
        const { id_room } = req.params;
        const bookings = await bookingsRepository.getBookingsByRoom(id_room);

        res.send(bookings);
    } catch (err) {
        next(err);
    }
}

async function getAllBookings(req, res, next) {
    try {
        const bookings = await bookingsRepository.getAllBookings();

        res.send(bookings);
    } catch (err) {
        next(err);
    }
}

//5.4-->BORRAR RESERVA
async function deleteBooking(req, res, next) {
    try {
        const { id_booking } = req.params;
        let booking = await bookingsRepository.getBookingById(id_booking);
        let user = await usersRepository.getUserById(id_booking.id_user);

        validateAuth.validateProperty(req, booking);
        const start_date = booking.start_date;

        if (!ValidateDate.isBeforeDate(start_date)) {
            const error = new Error('Minimo tiene que haber un dia de antelacion');
            throw error;
        }

        booking = await bookingsRepository.deleteBooking(id_booking, booking.id_user);

        res.status(201);
        await sendMails.sendMail({
            to: user.email,
            subject: 'Confirmación cancelación de tu reserva|| Create It',
            body: `¡Te confirmamos que se ha cancelado tu reserva ${id_booking}!  http://localhost:3000 `,
        });
        res.send({ Message: `Reserva ${id_booking} cancelada` });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBooking,
    deleteBooking,
    getBookingsByUser,
    getBookingsByRoom,
    getBookingsBySpace,
    payBooking,
    getBookingsCompletedByUser,
    getActiveBookingsByUser,
    getBookingById,
    getAllActiveBookingsBySpace,
    getAllBookings,
};
