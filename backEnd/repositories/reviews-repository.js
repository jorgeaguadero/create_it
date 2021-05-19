const { database } = require('../infrastructure');

async function getReviewsByUserId(userId) {
    const query = 'SELECT * FROM reviews WHERE id_user = ?';

    const [reviews] = await database.pool.query(query, userId);

    return reviews;
}

async function getAllReviews() {
    const query = 'SELECT * FROM reviews';
    const [reviews] = await database.pool.query(query);

    return reviews;
}

async function getReviewById(id) {
    const query = 'SELECT * FROM reviews WHERE id_user = ?';
    const [review] = await database.pool.query(query, id);

    return review;
}

async function createReview(id_booking, review_date, rating, text, id_user) {
    const query = 'INSERT INTO reviews (id_user,id_booking ,review_date, rating, text) VALUES (?, ?, ?, ?,?)';

    const [result] = await database.pool.query(query, [id_user, id_booking, review_date, rating, text]);

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
};
