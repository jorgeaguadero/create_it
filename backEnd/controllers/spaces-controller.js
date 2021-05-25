const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const multer = require('multer');
//const { v4: uuidv4 } = require('uuid');

//TODO pendiente gestión de fotos
const { spacesRepository } = require('../repositories');
const { usersRepository } = require('../repositories');
//TODO AÑADIR MEDIA DE RATING DE REVIEWS POR ESPACIO+ NUM REVIEWS??-> SINO SERIA 0 al inicio sin más info
async function createSpaces(req, res, next) {
    try {
        const { id_user, space_name, description, location, address, email, phone } = req.body;

        const schema = Joi.object({
            id_user: Joi.number()
                .required()
                .error(() => new Error('user')),
            space_name: Joi.string().required(),
            description: Joi.string().required(),
            location: Joi.string().required(),
            address: Joi.string(),
            email: Joi.string()
                .email()
                .required()
                .error(() => new Error('mail')),
            phone: Joi.string()
                .min(9)
                .max(14)
                .required()
                .error(() => new Error('mail')),
        });

        await schema.validateAsync({
            id_user,
            space_name,
            description,
            location,
            address,
            email,
            phone,
        });

        const space = await spacesRepository.getSpaceByEmail(email);
        if (space) {
            const err = new Error(`Ya existe un espacio con el email ${email}`);
            err.httpCode = 409;
            throw err;
        }
        const user = await usersRepository.findUserById(id_user);
        if (!user) {
            const err = new Error(`no existe ese usuario administrador`);
            err.httpCode = 409;
            throw err;
        }
        //comprobar que el administrador de la sala tiene rol de admin
        if (user.role !== 'admin') {
            const err = new Error('solo debe de administrar el administrador');
            err.httpCode = 403;
            throw err;
        }
        const createdSpace = await spacesRepository.createSpace({
            id_user,
            space_name,
            description,
            location,
            address,
            email,
            phone,
        });
        res.status(201);

        res.send({
            id_admin: createdSpace.id_user,
            Space_name: createdSpace.space_name,
            Description: createdSpace.description,
            location: createdSpace.location,
            email: createdSpace.email,
            phone: createdSpace.phone,
        });
    } catch (err) {
        next(err);
    }
}

async function updateSpace(req, res, next) {
    try {
        const { id_space } = req.params;
        const data = req.body;

        const space = await spacesRepository.updateSpace(data, id_space);

        res.status(201);

        res.send(space);
    } catch (error) {
        next(error);
    }
}

async function getSpaces(req, res, next) {
    try {
        const spaces = await spacesRepository.getSpaces();
        res.send(spaces);
    } catch (err) {
        next(err);
    }
}

async function viewSpace(req, res, next) {
    try {
        const { id_space } = req.params;

        space = await spacesRepository.getSpaceById(id_space);

        res.status(201);
        res.send(space);
    } catch (error) {
        next(error);
    }
}

async function deleteSpace(req, res, next) {
    try {
        const { id_space } = req.params;
        let space = await spacesRepository.getSpaceById(id_space);
        //TODO
        /*LÓGICA PARA VER SI TIENE RESERVAS PENDIENTES if (user.pending_payment === 0) {
            const err = new Error('No puedes borrar tu usuario hasta que no se realicen los pagos pendientes');
            err.httpCode = 403;
            throw err;
        }*/
        space = await spacesRepository.deleteSpace(id_space);

        res.status(201);
        res.send({ Message: `Espacio ${space} borrado` });
    } catch (error) {
        next(error);
    }
}
module.exports = {
    createSpaces,
    updateSpace,
    viewSpace,
    getSpaces,
    deleteSpace,
};
