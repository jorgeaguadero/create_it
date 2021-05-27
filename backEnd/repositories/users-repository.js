const { database } = require('../infrastructure');

//////////////////////////////////////
//         GETTERS
//////////////////////////////////////

async function getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [users] = await database.pool.query(query, email);

    return users[0];
}
async function getUserById(id) {
    const query = 'SELECT * FROM users WHERE id_user= ?';
    const [user] = await database.pool.query(query, id);

    return user[0];
}
async function getUsers() {
    const [users] = await database.pool.query('SELECT * FROM users');

    return users;
}
//////////////////////////////////////
//         CODES
//////////////////////////////////////
async function InsertUserCodes(data) {
    const query = 'INSERT INTO auth_codes (id_user,code) VALUES (?,?)';
    await database.pool.query(query, [data.id_user, data.activationCode]);

    return { Message: 'OK' };
}
async function getUserCodes(id_user) {
    const query = `SELECT auth_codes.code FROM auth_codes WHERE id_user = ${id_user}`;
    code = await database.pool.query(query);

    return code[0][0];
}
async function updateUserCodes(data) {
    const query = 'UPDATE auth_codes SET code=? WHERE id_user = ?';
    await database.pool.query(query, [data.activationCode, data.id_user]);

    return { Message: 'OK' };
}

//////////////////////////////////////
//         MANEJO USERS
//////////////////////////////////////

async function createUser(data) {
    const query = 'INSERT INTO users (first_name,last_name,email, passwordHash) VALUES (?,?,?,?)';
    await database.pool.query(query, [data.name, data.last_name, data.email, data.passwordHash]);

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
    const query = `UPDATE users SET modification_date = current_timestamp() WHERE id_user = '${id}'`;
    await database.pool.query(query);
    return getUserById(id);
}

async function updateAvatar(url, id) {
    let query = `UPDATE users SET avatar = '${url}',modification_date = current_timestamp() WHERE id_user = '${id}'`;
    await database.pool.query(query);
    return getUserById(id);
}

async function updatePassword(passwordHash, id_user) {
    const query = 'UPDATE users SET passwordHash = ? WHERE id_user = ?';
    await database.pool.query(query, [passwordHash, id_user]);

    return getUserById(id_user);
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
    getUserById,
    updatePassword,
    deleteUser,
    getUsers,
    updateAvatar,
    InsertUserCodes,
    getUserCodes,
    updateUserCodes,
};
