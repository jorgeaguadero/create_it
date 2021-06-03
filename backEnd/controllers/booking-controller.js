const Joi = require('joi');

//TODO VALIDATE USER PASARLO A MIDDLEWARE Y ASI ADMIN PUEDE TENER PERMISOS EXTRA
const { bookingsRepository } = require('../repositories');
const { dateValidate, validateAuth } = require('../middlewares');
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

        if (!dateValidate.isBeforeDate(start_date)) {
            const error = new Error('la fecha tiene que ser posterior a hoy');
            throw error;
        }

        const infoRoom = await bookingsRepository.getRoomInfo(start_date, id_room);

        if (!id_extra) {
            const booking = await bookingsRepository.createBooking(
                id,
                infoRoom.id_space,
                id_room,
                start_date,
                infoRoom.price
            );
            res.status(201);

            res.send({
                booking: booking.id_booking,
                user: booking.id_user,
                space: booking.id_space,
                room: booking.id_room,
                date: booking.start_date,
                price: booking.price,
            });
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
            //TODO envio Mail
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
        //TODO utils
        validateAuth.validateProperty(req, booking);

        if (booking.pending_payment === 0) {
            const error = new Error('ya está pagado');
            throw error;
        }

        const result = await bookingsRepository.payBooking(id_booking, id);
        //TODO envio Mail
        res.status(201);

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

//5.4-->BORRAR RESERVA
async function deleteBooking(req, res, next) {
    try {
        const { id_booking } = req.params;
        let booking = await bookingsRepository.getBookingById(id_booking);

        validateAuth.validateProperty(req, booking);
        const start_date = booking.start_date;

        if (!dateValidate.isBeforeDate(start_date)) {
            const error = new Error('Minimo tiene que haber un dia de antelacion');
            throw error;
        }
        //TODO envio Mail
        booking = await bookingsRepository.deleteBooking(id_booking, booking.id_user);

        res.status(201);
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
};
