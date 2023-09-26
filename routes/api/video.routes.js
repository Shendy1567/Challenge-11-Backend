const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { uploadVideo } = require('../../utils/uploadVideo'); // Gantilah sesuai dengan nama middleware upload video Anda

router.post('/upload-video', uploadVideo.single('video'), async (req, res) => { // Gantilah rute menjadi '/upload-video'
    try {
        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'video' }); // Tentukan resource_type: 'video' untuk mengunggah video

        return res.send({
            cloudinary_id: result.public_id,
            video_url: result.secure_url, // Ganti 'image_url' dengan 'video_url'
        });
    } catch (err) {
        let message = 'Tidak Ada File Yang Di Unggah';

        if (err.message.includes('unsupported format')) {
            message = 'Tipe file video tidak sesuai. Harap unggah file dengan format yang didukung.';
        }

        return res.status(500).json({ message: message });
    }
});

module.exports = router;
