const Joi = require('joi');

const { bookingsRepository, reviewsRepository } = require('../repositories');
const { isAfterDate } = require('../middlewares/dateValidate');

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
        if (Number(id_user) !== req.auth.id) {
            const err = new Error('El usuario no tiene permisos');
            err.status = 403;
            throw err;
        }

        const booking = await bookingsRepository.getBookingById(id_booking);
        const review_date = isAfterDate(booking.start_date);

        reviews = await reviewsRepository.getReviewsByUserId(id);
        const reviewCheck = reviews.some((r) => r.id_booking === Number(id_booking));

        if (reviewCheck) {
            const err = new Error('ya has realizado la review');
            err.status = 404;

            throw err;
        }

        const createdReview = await reviewsRepository.createReview(id_booking, review_date, rating, text, id_user);
        res.status(201);
        res.send(createdReview);
    } catch (err) {
        next(err);
    }
}

//Ver reviews por usuario
async function getReviewsByUserId(req, res, next) {
    try {
        const { id_user } = req.params;
        const { sortfield, sortdir } = req.query;
        const { role } = req.auth;

        const sortSchema = Joi.object({
            sortfield: Joi.string().valid('rating'),
            sortdir: Joi.string().valid('asc', 'desc'),
        });

        await sortSchema.validateAsync({ sortfield, sortdir });
        //Evaluamos primero el rol--> si es admin puede ver las reservas
        if (role === 'user' && Number(id_user) !== req.auth.id) {
            const err = new Error('El usuario no tiene permisos');
            err.status = 403;
            throw err;
        }

        const reviews = await reviewsRepository.getReviewsByUserId(id_user, sortfield, sortdir);
        res.send(reviews);
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

async function deleteReviewById(req, res, next) {
    try {
        const { id_user } = req.params;
        const { id } = req.auth;

        //TODO extraer
        if (Number(id_user) !== review[0].id_user) {
            const err = new Error('Sólo el dueño de la review o el admin puede borrar');
            err.code = 403;

            throw err;
        }

        await reviewsRepository.deleteReviewById(id_user);

        res.status(204);
        res.send('borrada');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createReview,
    getReviewsByUserId,
    getAllReviews,
    deleteReviewById,
};
