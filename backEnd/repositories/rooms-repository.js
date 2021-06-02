const { database } = require('../infrastructure');

//////////////////////////////////////
//        GETTERS
//////////////////////////////////////

async function getRoomById(id) {
    const query = 'SELECT * FROM rooms WHERE id_room= ?';
    const [rooms] = await database.pool.query(query, id);

    return rooms[0];
}
async function getRoomByCode(code) {
    const query = 'SELECT * FROM rooms WHERE room_code = ?';
    const [rooms] = await database.pool.query(query, code);

    return rooms[0];
}

async function getRoomsBySpace(id_space) {
    const [spaces] = await database.pool.query(`SELECT * FROM rooms WHERE id_space=${id_space}`);

    return spaces;
}

async function getRoomsByQuery(data) {
    let query = 'SELECT id_room from rooms';
    const params = [];
    let firstResults = '';

    const { id_space,type, price, capacity, start_date } = data;

    if (id_space ||type|| price || capacity) {
        query = `${query} WHERE `;
        const conditions = [];

        if (id_space) {
            conditions.push('id_space=?');
            params.push(id_space);
        }

        if (type) {
            conditions.push('type=?');
            params.push(type);
        }
        if (price) {
            conditions.push('price<=?');
            params.push(price);
        }

        if (capacity) {
            conditions.push('capacity<=?');
            params.push(capacity);
        }

        query = `${query} ${conditions.join(' AND ')}`;
        firstResults = await database.pool.query(query, params);
        //TODO si no hay --> error?
    }
    if (!start_date) {
        return firstResults[0];
    }

    //Declaro fuera para que pueda acceder a ella desde dentro de la funcion
    //Y después devolver el resultado con todo pusheado
    const finishResults = [];

    const findByDate = async (room, start = start_date) => {
        let query = `SELECT * FROM bookings WHERE start_date= '${start}'AND id_room=${room.id_room}`;
        const [bookings] = await database.pool.query(query);
        if (!bookings[0]) {
            query = `SELECT * FROM rooms WHERE  id_room=${room.id_room}`;

            //TODO tengo que hacer push de resultados[0]
            let result = await database.pool.query(query);
            finishResults.push(result[0]);
        }
    };

    for (const room of firstResults[0]) await findByDate(room);

    return finishResults;
}

//////////////////////////////////////
//        GESTIÓN DE SALAS
//////////////////////////////////////
/*async function createRoom(data) {
    const query = 'INSERT INTO rooms (id_space,room_code, description,price,capacity) VALUES (?,?,?,?,?)';
    await database.pool.query(query, [data.id_space, data.room_code, data.description, data.price, data.capacity]);

    return getRoomByCode(data.room_code);
}*/

async function updateRoom(data, id) {
    const replaceNotNull = async (row, value, id_room = id) => {
        if (value !== undefined) {
            const query = `UPDATE rooms SET ${row} = '${value}' WHERE id_room = '${id_room}'`;
            await database.pool.query(query);
        }
    };

    for (const row in data) await replaceNotNull(row, data[row]);

    return getRoomById(id);
}

/*async function setRoomsPhotos(id, url, description = 'prueba') {
    const query = 'INSERT INTO rooms_photo (id_room,description, url) VALUES (?,?,?)';
    await database.pool.query(query, [id, description, url]);
    return { Message: `foto subida` };
}*/

async function deleteRoom(id_room) {
    let query = 'SELECT rooms.room_code FROM rooms WHERE id_room ?';
    const room = await database.pool.query(query, id_room);
    query = 'DELETE FROM rooms WHERE id_room = ?';
    await database.pool.query(query, id_room);

    return room[0][0];
}

module.exports = {
    //createRoom,
    updateRoom,
    getRoomById,
    getRoomsBySpace,
    deleteRoom,
    getRoomByCode,
    getRoomsByQuery,
    //setRoomsPhotos,
};
