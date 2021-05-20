const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const multer = require('multer');
//const { v4: uuidv4 } = require('uuid');

//TODO pendiente gestión de fotos

const { roomsRepository, spacesRepository } = require('../repositories');

async function createRooms(req, res, next) {
    try {
        const { id_space, room_name, room_code, description, price, number_people } = req.body;

        const schema = Joi.object({
            id_space: Joi.number().required(),
            room_code: Joi.string().required(),
            room_name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            number_people: Joi.number().required(),
        });

        await schema.validateAsync({
            id_space,
            room_code,
            room_name,
            description,
            price,
            number_people,
        });

        const room = await roomsRepository.getRoomByCode(room_code);
        if (room) {
            const err = new Error(`Ya existe una sala con el código ${room.room_code}`);
            err.httpCode = 409;
            throw err;
        }
        const spaceExist = await spacesRepository.getSpaceById(id_space);
        if (!spaceExist) {
            const err = new Error(`No existe la sala ${id_space}`);
            err.httpCode = 409;
            throw err;
        }

        const createdRoom = await roomsRepository.createRoom({
            id_space,
            room_code,
            room_name,
            description,
            price,
            number_people,
        });
        res.status(201);

        res.send(createdRoom);
    } catch (err) {
        next(err);
    }
}

async function updateRoom(req, res, next) {
    try {
        const { id_room } = req.params;
        const data = req.body;

        const room = await roomsRepository.updateRoom(data, id_room);

        res.status(201);

        res.send(`Datos de: ${room.room_code} cambiados`);
    } catch (error) {
        next(error);
    }
}

async function getRoomsBySpace(req, res, next) {
    try {
        const { id_space } = req.params;
        const rooms = await roomsRepository.getRoomsBySpace(id_space);
        res.send(rooms);
    } catch (err) {
        next(err);
    }
}

async function viewRoom(req, res, next) {
    try {
        const { id_room } = req.params;

        room = await roomsRepository.getRoomById(id_room);

        res.status(201);
        res.send(room);
    } catch (error) {
        next(error);
    }
}

async function deleteRoom(req, res, next) {
    try {
        const { id_room } = req.params;
        let room = await roomsRepository.getRoomById(id_room);

        //TODO
        /*LÓGICA PARA VER SI TIENE RESERVAS PENDIENTES if (user.pending_payment === 0) {
            const err = new Error('No puedes borrar tu usuario hasta que no se realicen los pagos pendientes');
            err.httpCode = 403;
            throw err;
        }*/
        room = await roomsRepository.deleteRoom(id_room);

        res.status(201);
        res.send(`Espacio ${room} borrado`);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    createRooms,
    updateRoom,
    viewRoom,
    getRoomsBySpace,
    deleteRoom,
};
