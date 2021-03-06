const Joi = require('joi');

const { bookingsRepository, reviewsRepository, usersRepository } = require('../repositories');
const { validateAuth } = require('../middlewares/');
const { ValidateDate } = require('../utils');
const { sendMails } = require('../utils/');

//6.1--> CREAR RESERÑA
async function createReview(req, res, next) {
    try {
        const { id_user, id_booking } = req.params;
        const { id } = req.auth;
        const { rating, text } = req.body;

        const schema = Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            text: Joi.string().min(1).max(500),
        });

        await schema.validateAsync({ rating, text });

        const booking = await bookingsRepository.getBookingById(id_booking);
        const user = await usersRepository.getUserById(id);
        validateAuth.validateProperty(req, booking);

        const review_date = ValidateDate.isAfterDate(booking.start_date);

        const reviews = await reviewsRepository.getReviewsByUserId(id);
        const reviewCheck = reviews.some((r) => r.id_booking === Number(id_booking));

        if (reviewCheck) {
            const err = new Error('ya has realizado la review');
            err.status = 404;

            throw err;
        }

        const createdReview = await reviewsRepository.createReview(
            booking.id_space,
            id_booking,
            review_date,
            rating,
            text,
            id_user
        );
        res.status(201);
        await sendMails.sendMail({
            to: user.email,
            subject: 'Review Creada || Create It',
            body: `Review realizada!  http://localhost:3000 `,
        });
        res.send(createdReview);
    } catch (err) {
        next(err);
    }
}

//6.2.1--> VER RESEÑAS POR USUARIO (admin & user)
async function getReviewsByUserId(req, res, next) {
    try {
        const { id_user } = req.params;

        const reviews = await reviewsRepository.getReviewsByUserId(id_user);
        validateAuth.validateProperty(req, req.params);
        res.send(reviews);
    } catch (err) {
        next(err);
    }
}

//6.2.2 --> VER TODAS LAS RESEÑAS
async function getAllReviews(req, res, next) {
    try {
        const reviews = await reviewsRepository.getAllReviews();
        res.send(reviews);
    } catch (err) {
        next(err);
    }
}
//6.2.3 -> VER RESEÑAS POR ESPACIO
async function getReviewsBySpace(req, res, next) {
    try {
        const { id_space } = req.params;

        const reviews = await reviewsRepository.getReviewsBySpace(id_space);
        res.send(reviews);
    } catch (err) {
        next(err);
    }
}
//6.3 --> BORRAR RESEÑA USER Y/O ADMIN
async function deleteReviewById(req, res, next) {
    try {
        const { id_review } = req.params;

        validateAuth.validateProperty(req, req.params);

        await reviewsRepository.deleteReviewById(id_review);

        res.status(204);
        res.send({ Message: 'borrada' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createReview,
    getReviewsByUserId,
    getAllReviews,
    deleteReviewById,
    getReviewsBySpace,
};
