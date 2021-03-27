const express = require('express');
const { validationResult } = require('express-validator');
// multer for use with multipart enctype in form
const multer = require('multer');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

// middleware function to use inside post request handler
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {

});

router.post('/admin/products/new',
    upload.single('image'),
    [requireTitle, requirePrice],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.send(productsNewTemplate( { errors }));
        }

        // image is storing in buffer
        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image });
        res.send('submitted');
    });

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

module.exports = router;