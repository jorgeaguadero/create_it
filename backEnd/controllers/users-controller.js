const Joi = require('joi');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { usersRepository } = require('../repositories');

//Todo Añadir envio de mail para confirmaciones  --> token de validacion ?? --> sendgrid +nanoid
async function registrer(req, res, next) {
    try {
        const { name, last_name, email, password, repeatedPassword } = req.body;

        const schema = Joi.object({
            name: Joi.string()
                .required()
                .error(() => new Error('nombre')),
            last_name: Joi.string()
                .required()
                .error(() => new Error('Apellido')),
            email: Joi.string()
                .email()
                .required()
                .error(() => new Error('mail invalido')),
            password: Joi.string()
                .min(6)
                .max(12)
                .required()
                .error(() => new Error('pass1')),
            repeatedPassword: Joi.string()
                .min(6)
                .max(12)
                .required()
                .error(() => new Error('pass2')),
        });

        await schema.validateAsync({
            name,
            last_name,
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
            last_name,
            email,
            passwordHash,
        });
        res.status(201);
        const msg = {
            to: 'jorgeaguadero@gmail.com', // Change to your recipient
            from: 'jorgeaguadero91@outlook.es', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent');
            })
            .catch((error) => {
                console.error(error);
            });

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
//TODO comprobar si ya está logado o no --> front
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const schema = Joi.object({
            email: Joi.string()
                .email()
                .required()
                .error(() => new Error('mail invalido')),
            password: Joi.string()
                .min(6)
                .max(12)
                .required()
                .error(() => new Error('pass invalido')),
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

async function logout(req, res, next) {
    try {
        const { id_user } = req.params;
        const { id } = req.auth;
        if (Number(id_user) !== id) {
            const err = new Error('No eres el usuario ');
            err.httpCode = 403;
            throw err;
        }
        const tokenPayload = {};

        const token = jwt.sign(tokenPayload, process.env.SECRET);

        res.send({
            Message: 'Ha finalizado sesión con exito',
            token,
        });
    } catch (err) {
        next(err);
    }
}

//TODO corregir fecha actualizacion --> formato
async function updateProfile(req, res, next) {
    try {
        const { id_user } = req.params;
        const data = req.body;
        const ModDate = new Date();
        const schema = Joi.object({
            phone: Joi.string()
                .min(9) //numeros int
                .max(14)
                .error(() => new Error('movil')),
            bio: Joi.string().error(() => new Error('bio')),
        });

        await schema.validateAsync(data);

        const user = await usersRepository.updateProfile(data, id_user, ModDate);

        res.status(201);
        //TODO envio Mail
        res.send(user);
    } catch (error) {
        next(error);
    }
}

//TODO FOTO AVATAR -

async function updateAvatar(req, res, next) {
    try {
        const { file } = req;
        const { id_user } = req.params;

        const url = `static/users/${id_user}/${file.filename}`;
        const image = await usersRepository.updateAvatar(url, id_user);

        res.status(201);
        res.send(image);
    } catch (err) {
        next(err);
    }
}

//TODO Comprobar que nueva y vieja no son iguales
async function updatePassword(req, res, next) {
    try {
        const { id_user } = req.params;
        const data = req.body;

        const schema = Joi.object({
            password: Joi.string()
                .min(6)
                .max(12)
                .required()
                .error(() => new Error('passac')),
            newPassword: Joi.string()
                .min(6)
                .max(12)
                .required()
                .error(() => new Error('new1')),
            repeatedNewPassword: Joi.string()
                .min(6)
                .max(12)
                .required()
                .error(() => new Error('new2')),
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
        if (data.newPassword === data.password) {
            const err = new Error('no debe de ser igual');
            err.httpCode = 400;
            throw err;
        }

        const passwordHash = await bcrypt.hash(data.newPassword, 10);
        user = await usersRepository.updatePassword(passwordHash, id_user);
        //TODO envio Mail
        res.status(201);
        res.send(user);
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const { id_user } = req.params;
        const user = await usersRepository.findUserById(id_user);
        if (user.pending_payment === 1) {
            const err = new Error('No puedes borrar tu usuario hasta que no se realicen los pagos pendientes');
            err.httpCode = 403;
            throw err;
        }
        await usersRepository.deleteUser(id_user);

        res.status(201);
        res.send({ Message: 'Usuario borrado' });
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
    logout,
    updateAvatar,
    //deleteAvatar,
};
