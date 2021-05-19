const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const multer = require('multer');
//const { v4: uuidv4 } = require('uuid');

//TODO pendiente gestión de fotos
const { spacesRepository } = require('../repositories');

async function createSpaces(req, res, next) {
    try {
        const { id_user, space_name, description, location, address, email, phone } = req.body;

        const schema = Joi.object({
            id_user: Joi.number().required(),
            space_name: Joi.string().required(),
            description: Joi.string().required(),
            location: Joi.string().required(),
            address: Joi.string(),
            email: Joi.string().email().required(),
            phone: Joi.number().min(9).required(),
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
            err.code = 409;
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

        res.send(`Datos de: ${space.space_name} cambiados`);
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
            err.code = 403;
            throw err;
        }*/
        space = await spacesRepository.deleteSpace(id_space);

        res.status(201);
        res.send(`Espacio ${space} borrado`);
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
