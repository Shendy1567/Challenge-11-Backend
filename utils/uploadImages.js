const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadImage = multer({
    storage: multer.diskStorage({}),
    fileFilter(req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            cb(new Error('Unsupporter file type!'), false);
            return;
        }
        cb(null, true);
    }
});

module.exports = { cloudinary, uploadImage };