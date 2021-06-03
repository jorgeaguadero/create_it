const jwt = require('jsonwebtoken');

//TODO pasar a helper--> organizar validadores y helper
const { usersRepository } = require('../repositories');

//VALIDADORES DE AUTORIZACION PARA USUARIOS /ADMIN
async function validateAuthorization(req, res, next) {
    try {
        const { authorization } = req.headers;
        const { id_user } = req.params;

        const token = authorization.slice(7, authorization.length);
        if (token === 'null') {
            const error = new Error('Es necesario estar logueado');
            error.code = 401;
            throw error;
        }
        const decodedToken = jwt.verify(token, process.env.SECRET);

        if (!authorization || !decodedToken.id || !authorization.startsWith('Bearer ')) {
            const error = new Error('Es necesario estar logueado');
            error.code = 401;
            throw error;
        }

        const users = await usersRepository.getUserById(decodedToken.id);

        //caso muy remoto en el que el id del token ya no esté en base de datos
        if (!users || !users.length) {
            const error = new Error('El usuario logueado ya no se encuentra en nuestra base de datos');
            error.code = 401;
            throw error;
        }
        req.auth = decodedToken;
        if (id_user) {
            if (req.auth.role === 'user' && Number(id_user) !== req.auth.id) {
                const err = new Error('No tienes permisos para acceder');
                err.httpCode = 403;
                throw err;
            }
        }

        next();
    } catch (err) {
        next(err);
    }
}

async function validateAdmin(req, res, next) {
    const { role } = req.auth;
    try {
        if (role !== 'admin') {
            const err = new Error('Solo admins');
            err.status = 403;
            throw err;
        }
        next();
    } catch (err) {
        next(err);
    }
}

//Gestion de usuarios
async function validateUser(req, res, next) {
    try {
        let { id_user } = req.params;
        if (!id_user) {
            id_user = req.body.id_user;
        }
        const user = await usersRepository.getUserById(id_user);
        if (!user) {
            const err = new Error('No existe este usuario');
            err.httpCode = 401;
            throw err;
        }

        //se podria meter user en res??
        next();
    } catch (err) {
        next(err);
    }
}

function validateProperty(req, element, next) {
    if (req.auth.role === 'user' && Number(req.auth.id) !== Number(element.id_user)) {
        const error = new Error('Permiso denegado');
        throw error;
    } else {
        next();
    }
}

async function validateUserActivate(req, res, next) {
    try {
        const { id } = req.auth;

        const user = await usersRepository.getUserById(id);
        if (!user.activate) {
            const err = new Error('El usuario debe de estar activado');
            err.httpCode = 401;
            throw err;
        }

        next();
    } catch (err) {
        res.status(err.status || 500);
        res.send({ error: err.message });
    }
}

module.exports = {
    validateAuthorization,
    validateUser,
    validateAdmin,
    validateProperty,
    validateUserActivate,
};
