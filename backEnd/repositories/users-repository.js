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
    const query = 'INSERT INTO users (first_name,last_name,email, passwordHash) VALUES (?,?,?,?)';
    await database.pool.query(query, [data.name, data.last_name, data.email, data.passwordHash]);

    return getUserByEmail(data.email);
}

async function updateProfile(data, id, ModDate) {
    const replaceNotNull = async (row, value, id_user = id) => {
        if (value !== undefined && row !== 'role') {
            const query = `UPDATE users SET ${row} = '${value}' WHERE id_user = '${id_user}'`;
            await database.pool.query(query);
        }
    };

    for (const row in data) await replaceNotNull(row, data[row]);
    const query = `UPDATE users SET modification_date = '${ModDate}' WHERE id_user = '${id}'`;
    await database.pool.query(query);
    return findUserById(id);
}

async function updateAvatar(url, id) {
    const query = `UPDATE users SET avatar = '${url}' WHERE id_user = '${id}'`;
    await database.pool.query(query);
    return findUserById(id);
}

async function findUserById(id) {
    const query = 'SELECT * FROM users WHERE id_user= ?';
    const [user] = await database.pool.query(query, id);

    return user[0];
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

module.exports = {
    getUserByEmail,
    createUser,
    updateProfile,
    findUserById,
    updatePassword,
    deleteUser,
    getUsers,
    updateAvatar,
};
