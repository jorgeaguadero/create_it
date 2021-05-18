const { database } = require('../infrastructure');

async function getExtraById(id) {
    const query = 'SELECT * FROM extras WHERE id_extra= ?';
    const [extras] = await database.pool.query(query, id);

    return extras[0];
}
async function getExtraByCode(code) {
    const query = 'SELECT * FROM extras WHERE extra_code = ?';
    const [extras] = await database.pool.query(query, code);

    return extras[0];
}

async function createExtra(data) {
    const query = 'INSERT INTO extras (id_space,extra_code,description,stock,price) VALUES (?,?,?,?,?)';
    await database.pool.query(query, [data.id_space, data.extra_code, data.description, data.stock, data.price]);

    return getExtraByCode(data.extra_code);
}

async function updateExtra(data, id) {
    const replaceNotNull = async (row, value, id_extra = id) => {
        if (value !== undefined) {
            const query = `UPDATE extras SET ${row} = '${value}' WHERE id_extra = '${id_extra}'`;
            await database.pool.query(query);
        }
    };

    for (const row in data) await replaceNotNull(row, data[row]);

    return getExtraById(id);
}

async function getExtrasBySpace(id_space) {
    const [extras] = await database.pool.query(`SELECT * FROM extras WHERE id_space=${id_space}`);

    return extras;
}

async function deleteExtra(id_extra) {
    const query = 'DELETE FROM extras WHERE id_extra = ?';
    await database.pool.query(query, [id_extra]);

    return id_extra;
}

module.exports = {
    createExtra,
    updateExtra,
    getExtraById,
    getExtrasBySpace,
    deleteExtra,
    getExtraByCode,
};
