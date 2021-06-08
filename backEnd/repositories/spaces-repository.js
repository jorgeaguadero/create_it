const { database } = require('../infrastructure');

//////////////////////////////////////
//         GETTERS
//////////////////////////////////////

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

async function getRatingSpace(id_space) {
    const query = 'SELECT AVG(rating) from reviews WHERE id_space=?';
    const rating = await database.pool.query(query, id_space);

    return rating[0];
}

async function getAllRatingSpace() {
    const query = 'SELECT id_space, AVG(rating) from reviews GROUP BY id_space';
    const rating = await database.pool.query(query);

    return rating[0];
}

async function getSpaces() {
    const [spaces] = await database.pool.query(
        'SELECT spaces.*, AVG(reviews.rating) AS rating FROM spaces LEFT JOIN reviews ON spaces.id_space= reviews.id_space Group by spaces.id_space'
    );

    return spaces;
}

//////////////////////////////////////
//        GESTIÓN DE ESPACIOS
//////////////////////////////////////

/*async function createSpace(data) {
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
}*/

async function updateSpace(data, id) {
    const replaceNotNull = async (row, value, id_space = id) => {
        if (value !== undefined && row !== 'role') {
            const query = `UPDATE spaces SET ${row} = '${value}' WHERE id_space = '${id_space}'`;
            await database.pool.query(query);
        }
    };

    for (const row in data) await replaceNotNull(row, data[row]);
    const queryDate = `UPDATE spaces SET modification_date = current_timestamp() WHERE id_space = '${id}'`;
    await database.pool.query(queryDate);

    return getSpaceById(id);
}

/*async function setSpacesPhotos(id, url, description = 'prueba') {
    const query = 'INSERT INTO spaces_photo (id_space,description, url) VALUES (?,?,?)';
    await database.pool.query(query, [id, description, url]);
    return { Message: `foto subida` };
}*/

async function deleteSpace(id_space) {
    let query = 'SELECT spaces.email FROM spaces WHERE id_space= ?';
    const email = await database.pool.query(query, id_space);
    query = 'DELETE FROM spaces WHERE id_space = ?';
    await database.pool.query(query, id_space);

    return email[0][0];
}

module.exports = {
    getSpaceByEmail,
    //createSpace,
    updateSpace,
    getSpaceById,
    getSpaces,
    deleteSpace,
    getRatingSpace,
    //setSpacesPhotos,
    getAllRatingSpace,
};
