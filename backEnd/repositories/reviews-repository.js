const { database } = require('../infrastructure');

//////////////////////////////////////
//       GETTERS
//////////////////////////////////////
async function getReviewsByUserId(userId) {
    const query = 'SELECT * FROM reviews WHERE id_user = ?';

    const reviews = await database.pool.query(query, userId);

    return reviews[0];
}

async function getReviewsBySpace(spaceId) {
    const query = 'SELECT * FROM reviews WHERE id_space = ?';

    const [reviews] = await database.pool.query(query, spaceId);

    return reviews;
}

async function getAllReviews() {
    const query = 'SELECT * FROM reviews';
    const [reviews] = await database.pool.query(query);

    return reviews;
}

async function getReviewById(id) {
    const query = 'SELECT * FROM reviews WHERE id_review = ?';
    const [review] = await database.pool.query(query, id);

    return review[0];
}

//////////////////////////////////////
//       GESTIÓN DE REVIEWS
//////////////////////////////////////
async function createReview(space, id_booking, review_date, rating, text, id_user) {
    const query =
        'INSERT INTO reviews (id_space,id_user,id_booking ,review_date, rating, text) VALUES (?,?, ?, ?, ?,?)';

    const [result] = await database.pool.query(query, [space, id_user, id_booking, review_date, rating, text]);
    const query2 = 'UPDATE bookings SET review=1 WHERE id_booking = ?';
    await database.pool.query(query2, id_booking);

    return getReviewById(result.insertId);
}

async function deleteReviewById(id) {
    const query = 'DELETE FROM reviews WHERE id_review = ?';

    return database.pool.query(query, id);
}

module.exports = {
    getAllReviews,
    getReviewsByUserId,
    createReview,
    getReviewById,
    deleteReviewById,
    getReviewsBySpace,
};
