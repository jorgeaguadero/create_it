//TODO gestionar imagenes
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const userAvatar = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id_user } = req.params;
            const folder = path.join(__dirname, `../static/users/${id_user}/`);
            fs.mkdir(folder, { recursive: true });

            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 5242880, //  5 MB para avatar
    },
});

const spacePhotos = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id_space } = req.params;
            const folder = path.join(__dirname, `../static/spaces/${id_space}/`);
            fs.mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 15728640, //15MB
    },
});

const roomPĥotos = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id_room } = req.params;
            const folder = path.join(__dirname, `../static/rooms/${id_room}/`);
            fs.mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 15728640, //15MB
    },
});

const extraPĥoto = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id_extra } = req.params;
            const folder = path.join(`../static/extras/${id_extra}/`);
            fs.mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 15728640, //15MB
    },
});

async function deleteImage(file) {
    try {
        await fs.unlink(file);
    } catch (error) {
        throw new error('no sale');
    }
}

module.exports = {
    userAvatar,
    deleteImage,
    spacePhotos,
    roomPĥotos,
    extraPĥoto,
};
