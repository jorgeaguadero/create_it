const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const multer = require('multer');
//const { v4: uuidv4 } = require('uuid');

const { usersRepository } = require('../repositories');

//Todo Añadir envio de mail para confirmaciones  --> token de validacion ?? --> sendgrid +nanoid
async function registrer(req, res, next) {
    try {
        const { name, email, password, repeatedPassword } = req.body;

        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string()
                .email()
                .required()
                .error(() => new Error('mail invalido')),
            password: Joi.string().min(6).max(12).required(),
            repeatedPassword: Joi.string().min(6).max(12).required(),
        });

        await schema.validateAsync({
            name,
            email,
            password,
            repeatedPassword,
        });

        if (password !== repeatedPassword) {
            const err = new Error('Las contraseñas no coinciden');
            err.httpCode = 400;
            throw err;
        }

        const user = await usersRepository.getUserByEmail(email);
        if (user) {
            const err = new Error(`Ya existe un usuario con el email ${email}`);
            err.httpCode = 409;
            throw err;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const createdUser = await usersRepository.createUser({
            name,
            email,
            passwordHash,
        });
        res.status(201);

        res.send({
            id: createdUser.id_user,
            name: createdUser.first_name,
            email: createdUser.email,
            role: createdUser.role,
        });
    } catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(5).max(20).required(),
        });

        await schema.validateAsync({ email, password });

        const user = await usersRepository.getUserByEmail(email);

        if (!user) {
            const error = new Error('No existe el usuario');
            error.code = 404;
            throw error;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            const error = new Error('El password no es válido');
            error.code = 401;
            throw error;
        }

        const tokenPayload = { id: user.id_user, role: user.role };

        const token = jwt.sign(tokenPayload, process.env.SECRET, { expiresIn: '2d' });

        res.send({
            userId: user.id_user,
            token,
        });
    } catch (err) {
        next(err);
    }
}
async function updateProfile(req, res, next) {
    try {
        const { id_user } = req.params;
        const data = req.body;
        //TODO Joi
        const user = await usersRepository.updateProfile(data, id_user);

        res.status(201);

        res.send(`Datos del usuario: ${user.id_user} cambiados`);
    } catch (error) {
        next(error);
    }
}

//TODO FOTO AVATAR --> multer uuid??

async function updatePassword(req, res, next) {
    try {
        const { id_user } = req.params;
        const data = req.body;

        const schema = Joi.object({
            password: Joi.string().min(6).max(12).required(),
            newPassword: Joi.string().min(6).max(12).required(),
            repeatedNewPassword: Joi.string().min(6).max(12).required(),
        });
        await schema.validateAsync(data);
        //let por que luego volvemos a utilizar user para devolver la confirmacion
        let user = await usersRepository.findUserById(id_user);
        const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
        if (!isValidPassword) {
            const err = new Error('La contraseña actual es incorrecta');
            err.httpCode = 401;
            throw err;
        }

        if (data.newPassword !== data.repeatedNewPassword) {
            const err = new Error('Las constraseñas no coinciden');
            err.httpCode = 400;
            throw err;
        }

        const passwordHash = await bcrypt.hash(data.newPassword, 10);
        user = await usersRepository.updatePassword(passwordHash, id_user);

        res.status(201);
        //TODO respuestas json
        res.send(`user ${user.id_user} ha cambiado la contraseña`);
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const { id_user } = req.params;
        const user = await usersRepository.findUserById(id_user);
        if (user.pending_payment === 0) {
            const err = new Error('No puedes borrar tu usuario hasta que no se realicen los pagos pendientes');
            err.httpCode = 403;
            throw err;
        }
        await usersRepository.deleteUser(id_user);

        res.status(201);
        res.send('Usuario borrado');
    } catch (error) {
        next(error);
    }
}
async function viewProfileUser(req, res, next) {
    try {
        const { id_user } = req.params;

        user = await usersRepository.findUserById(id_user);

        res.status(201);
        res.send(user);
    } catch (error) {
        next(error);
    }
}

async function getUsers(req, res, next) {
    try {
        const users = await usersRepository.getUsers();
        res.send(users);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    registrer,
    login,
    updateProfile,
    updatePassword,
    deleteUser,
    viewProfileUser,
    getUsers,
    //updateAvatar,
    //deleteAvatar,
};
