const { database } = require('../infrastructure');
//const { format } = require('date-fns');

async function getRoomPrice(start, room) {
    let query = `SELECT * FROM bookings WHERE start_date= '${start}'AND id_room=${room}`;
    const [bookings] = await database.pool.query(query);
    if (bookings[0]) {
        const error = new Error('Está ocupado ese dia');
        throw error;
    } else {
        query = `SELECT rooms.price FROM rooms WHERE  id_room=${room}`;
        const roomPrice = await database.pool.query(query);
        return roomPrice[0][0];
    }
}
async function getExtraPrice(start, extra) {
    let query = `SELECT * FROM bookings WHERE start_date= '${start}'AND id_extra=${extra}`;
    const [extras] = await database.pool.query(query);
    if (extras[0]) {
        const error = new Error('No está disponible');
        throw error;
    } else {
        query = `SELECT extras.price FROM extras WHERE  id_extra=${extra}`;
        const extraPrice = await database.pool.query(query);
        return extraPrice[0][0];
    }
}

async function findBookingById(id) {
    const query = 'SELECT * FROM bookings WHERE id_booking = ?';
    const [booking] = await database.pool.query(query, id);

    return booking[0];
}

async function createBooking(id_user, id_room, start_date, price) {
    const query = 'INSERT INTO bookings (id_user,id_room, start_date,price) VALUES (?,?,?,?)';
    const [result] = await database.pool.query(query, [id_user, id_room, start_date, price]);

    return findBookingById(result.insertId);
}
async function createBookingWithExtra(id_user, id_room, start_date, price) {
    const query = 'INSERT INTO bookings (id_user,id_room,id_extra, start_date,price) VALUES (?,?,?,?,?)';
    const [result] = await database.pool.query(query, [id_user, id_room, id_extra, start_date, price]);

    return findBookingById(result.insertId);
}

async function updateBooking(data, id) {
    const replaceNotNull = async (row, value, id_extra = id) => {
        if (value !== undefined) {
            const query = `UPDATE extras SET ${row} = '${value}' WHERE id_extra = '${id_extra}'`;
            await database.pool.query(query);
        }
    };

    for (const row in data) await replaceNotNull(row, data[row]);

    return getExtraById(id);
}

module.exports = {
    getRoomPrice,
    getExtraPrice,
    createBooking,
    createBookingWithExtra,
    findBookingById,
    updateBooking,
};
