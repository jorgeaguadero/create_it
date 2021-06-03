//TODO gestionar imagenes y mail

const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { nextTick } = require('process');

//TODO extraer??--> avatar --> fileupload+ sharp-->

const userAvatar = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id_user } = req.params;
            const folder = path.join(__dirname, `/users/${id_user}/`);
            fs.mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
});

const spacePhotos = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id_space } = req.params;
            const folder = path.join(__dirname, `/spaces/${id_space}/`);
            fs.mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 1024 * 1024, // 1 MB
    },
});

const roomPĥotos = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id_room } = req.params;
            const folder = path.join(__dirname, `static/rooms/${id_room}/`);
            fs.mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        },
    }),
});

async function deleteImage(file) {
    try {
        await fs.unlink(file);
    } catch (error) {
        nextTick(error);
    }
}

module.exports = {
    userAvatar,
    deleteImage,
    spacePhotos,
    roomPĥotos,
};
