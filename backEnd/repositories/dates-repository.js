const { database } = require('../infrastructure');

async function getbookingDate(id_booking) {
    const query = `SELECT date_add(start_date,Interval -1 DAY) FROM bookings WHERE id_booking=${id_booking}`;
    const bookingDate = await database.pool.query(query);

    return bookingDate[0];
}

module.exports = {
    getbookingDate,
};
