const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const userAvatar = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const { id } = req.params;
            const folder = path.join(__dirname, `static/images/${id}/`);
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

module.exports = {
    userAvatar,
};
