const { database } = require('../infrastructure');

async function getSpaceByEmail(email) {
    const query = 'SELECT * FROM spaces WHERE email = ?';
    const [spaces] = await database.pool.query(query, email);

    return spaces[0];
}

async function getSpaceById(id) {
    const query = 'SELECT * FROM spaces WHERE id_space= ?';
    const [spaces] = await database.pool.query(query, id);

    return spaces[0];
}

async function createSpace(data) {
    const query =
        'INSERT INTO spaces (id_user,space_name, description,location,address,email,phone) VALUES (?,?,?,?,?,?,?)';
    await database.pool.query(query, [
        data.id_user,
        data.space_name,
        data.description,
        data.location,
        data.address,
        data.email,
        data.phone,
    ]);

    return getSpaceByEmail(data.email);
}

async function setSpacesPhotos(id, url, description = 'prueba') {
    const query = 'INSERT INTO spaces_photo (id_space,description, url) VALUES (?,?,?)';
    photo = await database.pool.query(query, [id, description, url]);
    return { Message: `foto subida` };
}

async function updateSpace(data, id) {
    const replaceNotNull = async (row, value, id_space = id) => {
        if (value !== undefined && row !== 'role') {
            const query = `UPDATE spaces SET ${row} = '${value}' WHERE id_space = '${id_space}'`;
            await database.pool.query(query);
        }
    };

    for (const row in data) await replaceNotNull(row, data[row]);

    return getSpaceById(id);
}

async function getSpaces() {
    const [spaces] = await database.pool.query('SELECT * FROM spaces');

    return spaces;
}

async function deleteSpace(id_space) {
    const query = 'DELETE FROM spaces WHERE id_space = ?';
    await database.pool.query(query, [id_space]);

    return id_space;
}

module.exports = {
    getSpaceByEmail,
    createSpace,
    updateSpace,
    getSpaceById,
    getSpaces,
    deleteSpace,
    setSpacesPhotos,
};
