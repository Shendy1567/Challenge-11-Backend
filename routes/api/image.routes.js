const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { uploadImage } = require('../../utils/uploadImages');


router.post('/upload', uploadImage.single('image'), async(req, res) => {

    try {
        const result = await cloudinary.uploader.upload(req.file.path);

        return res.send({
            cloudinary_id: result.public_id,
            image_url: result.secure_url,
        });
    } catch (err) {
        let message = 'Tidak Ada File Yang Di Unggah';


        if (err.message.includes('unsupported format')) {
            message = 'Tipe file gambar tidak sesuai. Harap unggah file dengan format JPG, JPEG, atau PNG.';
        }

        return res.status(500).json({ message: message });
        // return res.status(400).send({ message: err });
    }
});

module.exports = router;