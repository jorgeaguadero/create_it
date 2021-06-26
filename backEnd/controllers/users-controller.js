const Joi = require('joi');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const path = require('path');
const { usersRepository } = require('../repositories');
const { sendMails, images } = require('../utils/');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//1.1-->REGISTRO SE PASA COMPOBACIÓN DE REPETIDAS EN FRONT
async function registrer(req, res, next) {
    try {
        const { name, last_name, email, password } = req.body;

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
        });

        await schema.validateAsync({
            name,
            last_name,
            email,
            password,
        });

        const user = await usersRepository.getUserByEmail(email);
        if (user) {
            const err = new Error(`Ya existe un usuario con el email ${email}`);
            err.httpCode = 409;
            throw err;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const activationCode = nanoid(20);

        const createdUser = await usersRepository.createUser({
            name,
            last_name,
            email,
            passwordHash,
            activationCode,
        });

        await sendMails.sendMail({
            to: email,
            subject: 'Bienvenido a Create It',
            body: `Gracias por registrarte en Create IT , haz click aqui para activar tu cuenta: http://localhost:3000/user/verify/${createdUser.id_user}/${activationCode} `,
        });
        res.status(201);

        res.send({
            id: createdUser.id_user,
            name: createdUser.first_name,
            email: createdUser.email,
            role: createdUser.role,
            activationCode,
        });
    } catch (err) {
        next(err);
    }
}

//1.2-->CONFIRMACION DE USUARIO
async function confirmationUser(req, res, next) {
    try {
        const { activationCode, id_user } = req.params;

        const user = await usersRepository.getUserById(id_user);
        if (!user) {
            const error = new Error('no existe usuario');
            throw error;
        }
        if (user.activate) {
            const error = new Error('usuario ya activado');
            throw error;
        }

        const code = await usersRepository.getUserCodes(user.id_user);
        if (activationCode !== code.activation_code) {
            const error = new Error('código incorrecto');
            throw error;
        }

        const activateUser = await usersRepository.updateProfile({ activate: 1 }, user.id_user);
        res.send(activateUser);
    } catch (error) {
        next(error);
    }
}

//TODO comprobar si ya está logado o no --> front

//2.1-->LOGIN DE USUARIO
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
            id_user: user.id_user,
            name: user.first_name,
            avatar: user.avatar,
            role: user.role,
            token,
        });
    } catch (err) {
        next(err);
    }
}

//2.2-->LOGOUT DE USUARIO
async function logout(req, res, next) {
    try {
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

//3.1-ACTUALIZACIÓN DE DATOS DE PERFIL
async function updateProfile(req, res, next) {
    try {
        const { id_user } = req.params;
        const data = req.body;

        const schema = Joi.object({
            phone: Joi.string()
                .min(9) //numeros int
                .max(14)
                .error(() => new Error('movil')),
            bio: Joi.string().error(() => new Error('bio')),
        });
        await schema.validateAsync(data);
        const user = await usersRepository.updateProfile(data, id_user);

        res.status(201);
        res.send(user);
    } catch (error) {
        next(error);
    }
}

//TODO FOTO AVATAR -
//3.2-ACTUALIZACIÓN DE AVATAR DEL PERFIL

//Avatar  con sharp y express-fileupload -->> tutoria en videoshackaboss

async function addAvatar(req, res, next) {
    try {
        const { file } = req;
        const { id_user } = req.params;
        if (!file) {
            const error = new Error('Es necesario subir un fichero');
            error.httpCode = 400;
            throw error;
        }

        const user = await usersRepository.getUserById(id_user);
        if (user.avatar) {
            await images.deleteImage(user.avatar);
        }
        const url = path.join(__dirname, `../static/users/${id_user}/${file.filename}`);
        const updateUser = await usersRepository.updateAvatar(url, id_user);

        res.status(201);
        res.send({ user: updateUser });
    } catch (err) {
        next(err);
    }
}

//3.4-ACTUALIZACIÓN DE CONTRASEÑA --> SE PASA COMPOBACIÓN DE REPETIDAS EN FRONT
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
        let user = await usersRepository.getUserById(id_user);
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
        res.send({ message: `password cambiado` });
    } catch (error) {
        next(error);
    }
}

//3.5.1-->RECUPERAR CONTRASEÑA PARTE 1
async function recoverPassword(req, res, next) {
    try {
        const { email } = req.body;
        const activationCode = nanoid(20);

        const user = await usersRepository.getUserByEmail(email);
        await usersRepository.updateUserCodes({ id_user: user.id_user, activationCode });

        await sendMails.sendMail({
            to: email,
            subject: 'Recupera tu contraseña',
            body: `http://localhost:3000/user/recoveryPassword/${user.id_user}/${activationCode}`,
        });
        res.send({
            id_user: user.id_user,
            email,
            activationCode,
        });
    } catch (error) {
        next(error);
    }
}
//3.5.2-->RECUPERAR CONTRASEÑA PARTE 2
async function newPassword(req, res, next) {
    try {
        const { activationCode, id_user } = req.params;
        const data = req.body;

        const user = await usersRepository.getUserById(id_user);
        if (!user) {
            const error = new Error('no existe usuario');
            throw error;
        }

        const code = await usersRepository.getUserCodes(user.id_user);
        if (activationCode !== code.activation_code) {
            const error = new Error('código y/o usuario incorrecto');
            throw error;
        }

        const schema = Joi.object({
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

        const passwordHash = await bcrypt.hash(data.newPassword, 10);
        await usersRepository.updatePassword(passwordHash, id_user);

        res.send({ Message: 'Contraseña actualizada' });
    } catch (error) {
        next(error);
    }
}

//1.4--> BORRARME COMO USUARIO
async function deleteUser(req, res, next) {
    try {
        const { id_user } = req.params;
        const user = await usersRepository.getUserById(id_user);
        if (user.pending_payment === 1) {
            const err = new Error('No puedes borrar tu usuario hasta que no se realicen los pagos pendientes');
            err.httpCode = 403;
            throw err;
        }
        const email = await usersRepository.deleteUser(id_user);

        res.status(201);
        res.send({ Message: `Usuario ${email.email} borrado` });
    } catch (error) {
        next(error);
    }
}
//1.5.1--> VER MI PERFIL
async function viewProfileUser(req, res, next) {
    try {
        const { id_user } = req.params;
        const user = await usersRepository.getUserById(id_user);
        res.status(201);
        res.send(user);
    } catch (error) {
        next(error);
    }
}
//1.5.2--> VER TODOS LOS PERFILES
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

    //deleteAvatar,
    addAvatar,
    confirmationUser,
    recoverPassword,
    newPassword,
};
