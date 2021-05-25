const Joi = require('joi');

const { bookingsRepository, reviewsRepository } = require('../repositories');
const { isAfterDate, isBeforeDate } = require('../middlewares/dateValidate');
const { validateProperty } = require('../utils/users-auth');

//-->Crear review (user)
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

        //TODO extraer como función ??
        validateProperty(req, req.params);

        const booking = await bookingsRepository.getBookingById(id_booking);
        validateProperty(req, booking);
        const review_date = new Date();
        //cambio a before para pruebas y añado fechade hor
        /*const review_date = isBeforeDate(booking.start_date);*/

        reviews = await reviewsRepository.getReviewsByUserId(id);
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
        //TODO envio Mail
        res.status(201);
        res.send({ createdReview });
    } catch (err) {
        next(err);
    }
}

//Ver reviews por usuario
async function getReviewsByUserId(req, res, next) {
    try {
        const { id_user } = req.params;

        const reviews = await reviewsRepository.getReviewsByUserId(id_user);
        validateProperty(req, req.params);
        res.send({ reviews });
    } catch (err) {
        next(err);
    }
}

async function getAllReviews(req, res, next) {
    try {
        const reviews = await reviewsRepository.getAllReviews();
        res.send(reviews);
    } catch (err) {
        next(err);
    }
}

async function getReviewsBySpace(req, res, next) {
    try {
        const { id_space } = req.params;

        const reviews = await reviewsRepository.getReviewsBySpace(id_space);
        res.send(reviews);
    } catch (err) {
        next(err);
    }
}

async function deleteReviewById(req, res, next) {
    try {
        const { id_review } = req.params;

        validateProperty(req, req.params);

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
