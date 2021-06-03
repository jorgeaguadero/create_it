const Joi = require('joi');

const { spacesRepository, extrasRepository } = require('../repositories');


//4.1-->CREAR EXTRA
async function createExtras(req, res, next) {
    try {
        const { id_space, extra_code, type, description, price, photo } = req.body;

        const schema = Joi.object({
            id_space: Joi.number().required(),
            extra_code: Joi.string().required(),
            type: Joi.number().min(1).max(3).required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            photo: Joi.string(),
        });

        await schema.validateAsync({
            id_space,
            extra_code,
            type,
            description,
            price,
            photo,
        });

        const extra = await extrasRepository.getExtraByCode(extra_code);
        if (extra) {
            const err = new Error(`Ya existe un extra con el código ${extra.extra_code}`);
            err.httpCode = 409;
            throw err;
        }
        const spaceExist = await spacesRepository.getSpaceById(id_space);
        if (!spaceExist) {
            const err = new Error(`No existe el espacio ${id_space}`);
            err.httpCode = 409;
            throw err;
        }

        const createdExtra = await extrasRepository.createExtra({
            id_space,
            extra_code,
            type,
            description,
            price,
            photo,
        });
        res.status(201);

        res.send(createdExtra);
    } catch (err) {
        next(err);
    }
}

//4.2-->ACTUALIZAR EXTRA
async function updateExtra(req, res, next) {
    try {
        const { id_extra } = req.params;
        const data = req.body;

        const schema = Joi.object({
            description: Joi.string(),
            price: Joi.number(),
            photo: Joi.string(),
        });

        await schema.validateAsync(data);

        const extra = await extrasRepository.updateExtra(data, id_extra);

        res.status(201);

        res.send({ extraMessage: `Datos de: ${extra.extra_code} cambiados` });
    } catch (error) {
        next(error);
    }
}

//4.3.1-->VER EXTRA POR ESPACIO
async function getExtrasBySpace(req, res, next) {
    try {
        const { id_space } = req.params;
        const extras = await extrasRepository.getExtrasBySpace(id_space);
        res.send(extras);
    } catch (err) {
        next(err);
    }
}

//4.3.2--> VER EXTRA POR TIPO + ESPACIO
async function getExtrasByType(req, res, next) {
    try {
        const { id_space, type } = req.params;
        const extras = await extrasRepository.getExtrasBytype(id_space, type);
        res.send(extras);
    } catch (err) {
        next(err);
    }
}

//4.3.3-->VER EXTRA POR ID EXTRA
async function viewExtra(req, res, next) {
    try {
        const { id_extra } = req.params;

        const extra = await extrasRepository.getExtraById(id_extra);

        res.status(201);
        res.send(extra);
    } catch (error) {
        next(error);
    }
}

//4.4-->BORRAR
async function deleteExtra(req, res, next) {
    try {
        const { id_extra } = req.params;
        let extra = await extrasRepository.getExtraById(id_extra);
        /*LÓGICA PARA VER SI TIENE RESERVAS PENDIENTES if (user.pending_payment === 0) {
            const err = new Error('No puedes borrar tu usuario hasta que no se realicen los pagos pendientes');
            err.httpCode = 403;
            throw err;
        }*/
        extra = await extrasRepository.deleteExtra(id_extra);

        res.status(201);
        res.send({ Message: `Extra ${extra} borrado`, extra });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createExtras,
    updateExtra,
    viewExtra,
    getExtrasBySpace,
    deleteExtra,
    getExtrasByType,
};
