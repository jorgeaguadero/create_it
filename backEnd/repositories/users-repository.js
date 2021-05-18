const { database } = require('../infrastructure');

async function getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [users] = await database.pool.query(query, email);

    return users[0];
}

async function getUsers() {
    const [users] = await database.pool.query('SELECT * FROM users');

    return users;
}

async function createUser(data) {
    const query = 'INSERT INTO users (first_name,email, passwordHash) VALUES (?,?,?)';
    await database.pool.query(query, [data.name, data.email, data.passwordHash]);

    return getUserByEmail(data.email);
}

async function updateProfile(data, id) {
    const replaceNotNull = async (row, value, id_user = id) => {
        if (value !== undefined && row !== 'role') {
            const query = `UPDATE users SET ${row} = '${value}' WHERE id_user = '${id_user}'`;
            await database.pool.query(query);
        }
    };

    for (const row in data) await replaceNotNull(row, data[row]);

    return findUserById(id);
}

async function updateImage(id, imagePath) {
    /** La funcion espera como parametros el id del usuario y la ruta
     *  en la que guardar la imagen con su nombre incluido como uuid
     */
    // obtener path a la imagen anterior del usuario
    const searchQuery = 'SELECT image FROM users WHERE id = ?';
    const [[{ image }]] = await database.pool.query(searchQuery, id);
    // borrar imagen anterior si existe
    image !== null ? await fs.unlink(image) : image;

    // acualizar la path a la imagen en la info del usuario
    const updateQuery = 'UPDATE users SET image = ? WHERE id = ?';
    await database.pool.query(updateQuery, [imagePath, id]);

    return findUserById(id);
}

async function findUserById(id) {
    const query = 'SELECT * FROM users WHERE id_user= ?';
    const [users] = await database.pool.query(query, id);

    return users[0];
}

async function updatePassword(passwordHash, id_user) {
    const query = 'UPDATE users SET passwordHash = ? WHERE id_user = ?';
    await database.pool.query(query, [passwordHash, id_user]);

    return findUserById(id_user);
}
async function deleteUser(id_user) {
    const query = 'DELETE FROM users WHERE id_user = ?';
    await database.pool.query(query, [id_user]);

    return id_user;
}

/*async function updateAvatar(id_user, imagePath) {
    //Primero borramos la foto anterior si la hubiese para no usar esa memoria
    let query = 'SELECT avatar FROM users WHERE id_user = ?';
    const [[{ avatar }]] = await database.pool.query(query, id_user);
    // borrar imagen anterior si existe
    avatar !== null ? await fs.unlink(avatar) : avatar;

    // acualizar la path a la imagen en la info del usuario
    query = 'UPDATE users SET avatar= ? WHERE id_user = ?';
    await database.pool.query(updateQuery, [imagePath, id]);

    return findUserById(id);
}*/

module.exports = {
    getUserByEmail,
    createUser,
    updateProfile,
    findUserById,
    updatePassword,
    deleteUser,
    getUsers,

    //updateAvatar
};
