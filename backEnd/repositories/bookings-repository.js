const { database } = require('../infrastructure');

//////////////////////////////////////
//       GETTERS
//////////////////////////////////////
async function getBookingById(id) {
    const query = 'SELECT * FROM bookings WHERE id_booking = ?';
    const [booking] = await database.pool.query(query, id);

    return booking[0];
}

async function getBookingsByUser(id_user) {
    const query = 'SELECT * FROM bookings WHERE id_user = ?';
    const [booking] = await database.pool.query(query, id_user);

    return booking;
}
async function getBookingsCompletedByUser(id_user) {
    const query = `SELECT * FROM bookings WHERE id_user =${id_user} AND start_date <current_timestamp()`;
    const [booking] = await database.pool.query(query);

    return booking;
}
async function getPendingBookingsByUser(id_user) {
    const query = `SELECT * FROM bookings WHERE id_user =${id_user} AND start_date >=current_timestamp()`;
    const [booking] = await database.pool.query(query);

    return booking;
}

async function getBookingsBySpace(id_space) {
    const query = 'SELECT * FROM bookings WHERE id_space = ?';
    const [booking] = await database.pool.query(query, id_space);

    return booking;
}

async function getPendingBySpace(id_space) {
    const query = 'SELECT * FROM bookings WHERE id_space = ? AND booking_date >=current_timestamp()';
    const [booking] = await database.pool.query(query, id_space);

    return booking;
}

async function getPendingByRoom(id_room) {
    const query = 'SELECT * FROM bookings WHERE id_room = ? AND booking_date <=current_timestamp()';
    const [booking] = await database.pool.query(query, id_room);

    return booking;
}

async function getBookingsByRoom(id_room) {
    const query = 'SELECT * FROM bookings WHERE id_room = ?';
    const [booking] = await database.pool.query(query, id_room);

    return booking;
}

async function getRoomInfo(start, room) {
    let query = `SELECT * FROM bookings WHERE start_date= '${start}'AND id_room=${room}`;
    const [bookings] = await database.pool.query(query);
    if (bookings[0]) {
        const error = new Error('Está ocupado ese dia');
        throw error;
    } else {
        query = `SELECT rooms.price, rooms.id_space, rooms.type FROM rooms WHERE  id_room=${room}`;
        const roomInfo = await database.pool.query(query);
        return roomInfo[0][0];
    }
}
async function getExtraInfo(startDate, extra, id_space) {
    let query = `SELECT * FROM bookings WHERE start_date= '${startDate}'AND id_extra=${extra}`;
    const [extras] = await database.pool.query(query);
    if (extras[0]) {
        const error = new Error('El extra No está disponible');
        throw error;
    } else {
        query = `SELECT extras.price, extras.type FROM extras WHERE  id_extra=${extra} AND id_space=${id_space}`;
        const extraInfo = await database.pool.query(query);
        return extraInfo[0][0];
    }
}

//////////////////////////////////////
//       gestion de reservas
//////////////////////////////////////
async function createBooking(id_user, id_space, id_room, start_date, price) {
    let query = 'INSERT INTO bookings (id_user,id_space,id_room, start_date,price) VALUES (?,?,?,?,?)';
    const [result] = await database.pool.query(query, [id_user, id_space, id_room, start_date, price]);
    query = `UPDATE users SET pending_payment = 1 WHERE id_user = ${id_user}`;
    await database.pool.query(query, [id_user]);
    return getBookingById(result.insertId);
}
async function createBookingWithExtra(id_user, id_space, id_room, id_extra, start_date, price) {
    let query = 'INSERT INTO bookings (id_user,id_space,id_room,id_extra, start_date,price) VALUES (?,?,?,?,?,?)';
    const [result] = await database.pool.query(query, [id_user, id_space, id_room, id_extra, start_date, price]);
    query = `UPDATE users SET pending_payment = 1 WHERE id_user = '${id_user}'`;
    await database.pool.query(query, [id_user]);
    return getBookingById(result.insertId);
}

//Modificar--Pagar
async function payBooking(id_booking, id_user) {
    let query = `UPDATE bookings SET pending_payment=0 WHERE id_booking = ${id_booking}`;
    await database.pool.query(query);
    query = `SELECT * FROM bookings WHERE id_user=${id_user} AND pending_payment=1`;
    const pendingUser = await database.pool.query(query, id_user);

    if (pendingUser[0].length === 0) {
        query = `UPDATE users SET pending_payment =0 WHERE id_user =${id_user}`;
        await database.pool.query(query);
        return { Message: `Pago de ${id_booking}correcto. Usuario: ${id_user} no tiene pagos pendientes` };
    } else {
        return { Message: `pago de ${id_booking} correcto` };
    }
}

//borrar
async function deleteBooking(id_booking, id_user) {
    let query = `DELETE FROM bookings WHERE id_booking = ${id_booking}`;
    await database.pool.query(query);
    query = `SELECT * FROM bookings WHERE id_user=${id_user} AND pending_payment=1`;
    const pendingUser = await database.pool.query(query, id_user);

    if (pendingUser[0].length === 0) {
        query = `UPDATE users SET pending_payment =0  WHERE id_user = ${id_user}`;
        await database.pool.query(query, id_user);
        return { Message: 'ok' };
    }

    return id_booking;
}

//TODO envio mail aqui o en controller
//  return ('Payment OK');

module.exports = {
    getRoomInfo,
    getExtraInfo,
    createBooking,
    createBookingWithExtra,
    payBooking,
    getBookingById,
    deleteBooking,
    getBookingsByUser,
    getBookingsByRoom,
    getBookingsBySpace,
    getPendingBySpace,
    //payBooking,
    getPendingByRoom,
    getBookingsCompletedByUser,
    getPendingBookingsByUser,
};
