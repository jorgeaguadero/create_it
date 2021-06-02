const Joi = require('joi');

const { spacesRepository, bookingsRepository } = require('../repositories');

//TODO AÑADIR MEDIA DE RATING DE REVIEWS POR ESPACIO+ NUM REVIEWS??-> SINO SERIA 0 al inicio sin más info

/*2.1-->CREAR ESPACIOS
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
}*/

//2.2-->ACTUALIZAR DATOS DEL ESPACIO
async function updateSpace(req, res, next) {
    try {
        const { id_space } = req.params;
        const data = req.body;
        const schema = Joi.object({
            description: Joi.string(),
            location: Joi.string(),
            address: Joi.string(),
            email: Joi.string()
                .email()
                .error(() => new Error('mail')),
            phone: Joi.string()
                .min(9)
                .max(14)
                .error(() => new Error('phone')),
        });
        await schema.validateAsync(data);

        const space = await spacesRepository.updateSpace(data, id_space);

        res.status(201);

        res.send(space);
    } catch (error) {
        next(error);
    }
}

//TODO EXTRA
/*async function setSpacesPhotos(req, res, next) {
    try {
        const { files } = req;
        const { id_space } = req.params;
        //const { description } = req.body;
        files.forEach(async (photo) => {
            const url = `static/spaces/${id_space}/${photo.filename}`;
            await spacesRepository.setSpacesPhotos(id_space, url);
        });

        res.status(201);
        res.send({ Message: `Fotos subidas correctamente` });
    } catch (err) {
        next(err);
    }
}*/

//2.3.1-->VER ESPACIO POR ID
async function viewSpace(req, res, next) {
    try {
        const { id_space } = req.params;

        const space = await spacesRepository.getSpaceById(id_space);
        const rating = await spacesRepository.getRatingSpace(id_space);

        res.status(201);
        res.send({ space, rating });
    } catch (error) {
        next(error);
    }
}

//2.3.2-->VER TODOS LOS ESPACIOS
async function getSpaces(req, res, next) {
    try {
        const spaces = await spacesRepository.getSpaces();
        const ratings = await spacesRepository.getAllRatingSpace();
        res.send({ spaces, ratings });
    } catch (err) {
        next(err);
    }
}



//2.4-->BORRAR ESPACIOS
async function deleteSpace(req, res, next) {
    try {
        const { id_space } = req.params;

        //TODO
        const pending = await bookingsRepository.getPendingBySpace(id_space);
        if (pending[0] !== 0) {
            const err = new Error('No se puede borrar porque hay reservas pendientes');
            err.httpCode = 403;
            throw err;
        }
        const email = await spacesRepository.deleteSpace(id_space);

        res.status(201);
        res.send({ Message: `Espacio ${email.email} borrado` });
    } catch (error) {
        next(error);
    }
}
module.exports = {
    //createSpaces,
    updateSpace,
    viewSpace,
    getSpaces,
    deleteSpace,
    //setSpacesPhotos,
};
