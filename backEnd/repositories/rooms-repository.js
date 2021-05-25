const { database } = require('../infrastructure');

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

async function createRoom(data) {
    const query = 'INSERT INTO rooms (id_space,room_code, description,price,capacity) VALUES (?,?,?,?,?)';
    await database.pool.query(query, [data.id_space, data.room_code, data.description, data.price, data.capacity]);

    return getRoomByCode(data.room_code);
}

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

async function getRoomsBySpace(id_space) {
    const [spaces] = await database.pool.query(`SELECT * FROM rooms WHERE id_space=${id_space}`);

    return spaces;
}

async function deleteRoom(id_room) {
    const query = 'DELETE FROM rooms WHERE id_room = ?';
    await database.pool.query(query, [id_room]);

    return id_room;
}

module.exports = {
    createRoom,
    updateRoom,
    getRoomById,
    getRoomsBySpace,
    deleteRoom,
    getRoomByCode,
};
