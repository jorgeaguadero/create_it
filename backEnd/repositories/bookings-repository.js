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

async function getBookingById(id) {
    const query = 'SELECT * FROM bookings WHERE id_booking = ?';
    const [booking] = await database.pool.query(query, id);

    return booking[0];
}
async function getBookingsByUser(id_user) {
    const query = 'SELECT * FROM bookings WHERE id_user = ?';
    const [booking] = await database.pool.query(query, id_user);

    return booking[0];
}
//TODO INSERTAR PENDIENTE DE PAGO EN USUARIO Y BOOKINGS
async function createBooking(id_user, id_room, start_date, price) {
    const query = 'INSERT INTO bookings (id_user,id_room, start_date,price) VALUES (?,?,?,?)';
    const [result] = await database.pool.query(query, [id_user, id_room, start_date, price]);

    return getBookingById(result.insertId);
}
async function createBookingWithExtra(id_user, id_room, id_extra, start_date, price) {
    const query = 'INSERT INTO bookings (id_user,id_room,id_extra, start_date,price) VALUES (?,?,?,?,?)';
    const [result] = await database.pool.query(query, [id_user, id_room, id_extra, start_date, price]);

    return getBookingById(result.insertId);
}
async function deleteBooking(id_booking) {
    const query = `DELETE FROM bookings WHERE id_booking = ${id_booking}`;
    await database.pool.query(query);

    return id_booking;
}
//TODO INSERTAR PENDIENTE DE PAGO EN USUARIO Y BOOKINGS
/*async function payBooking(id_booking, id_user) {
    const queryPayBooking = `UPDATE bookings SET payment_state=1 WHERE id_booking = ${id_booking}`;
    await database.pool.query(queryPayBooking);
    
    const queryPayUser = `UPDATE users SET pending_payment=1 WHERE id_user = ${id_user}`;
    await database.pool.query(queryPayuser);
//TODO envio mail aqui o en controller
   return ('Payment OK');
}*/

//TODO ajustar query para obtener bookings por el id_space--> modificar DB
async function getBookingsBySpace(id_space) {
    const query = 'SELECT * FROM bookings INNER JOIN spaces ON spaces.id_space = ?';
    const [booking] = await database.pool.query(query, id_space);

    return booking;
}

async function getBookingsByRoom(id_room) {
    const query = 'SELECT * FROM bookings WHERE id_room = ?';
    const [booking] = await database.pool.query(query, id_room);

    return booking;
}

module.exports = {
    getRoomPrice,
    getExtraPrice,
    createBooking,
    createBookingWithExtra,
    getBookingById,
    deleteBooking,
    getBookingsByUser,
    getBookingsByRoom,
    getBookingsBySpace,
    //payBooking,
};
