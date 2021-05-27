//TODO gestionar imagenes y mail

const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const sharp = require('sharp');
//const { v4: uuidv4 } = require('uuid'); --> o nanoid??
const { nanoid } = require('nanoid');

////Creamos la ruta al directorio de uploads
//TODO personalizar para cada usuario--> asi solo puede ver cada uno su foto

const uploadsDir = path.join(__dirname, `${process.env.UPLOADS_DIRECTORY}/users/`);
async function saveAvatar({ file }) {
    try {
        ////Nos aseguramos de que el directorio existe
        await fs.mkdir(uploadsDir, { recursive: true });

        ////Cargamos la imagen en sharp --> https://github.com/lovell/sharp
        const image = sharp(file.data);

        //TODOModificamos el tamaño de la imagen a un estandar--> ver en webs fotos de avatar
        image.resize(500);

        //TODO webp
        const fileName = `${nanoid(20)}.jpg`;

        //Guardamos la imagen en el directorio de uploadas
        await image.toFile(path.join(uploadsDir, fileName));

        //devolvemos el nombre del fichero
        return fileName;
    } catch (error) {
        throw new Error('Error subiendo imagen');
    }
}

async function deleteAvatar({ file }) {
    const avatarPath = path.join(uploadsDir, file);
    await fs.unlink(avatarPath);
}

module.exports = {
    saveAvatar,
    deleteAvatar,
};
