const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadVideo = multer({
    storage: multer.memoryStorage(), // Menggunakan memory storage untuk mengunggah video
    fileFilter(req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4' && ext !== '.mov' && ext !== '.avi') { // Sesuaikan ekstensi yang diizinkan dengan jenis video yang Anda inginkan
            cb(new Error('Unsupported file type!'), false);
            return;
        }
        cb(null, true);
    }
});

module.exports = { cloudinary, uploadVideo };
