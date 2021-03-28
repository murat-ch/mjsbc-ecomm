const express = require('express');
// multer for use with multipart enctype in form
const multer = require('multer');
const { handleErrors } = require('./middleware');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();

// middleware function to use inside post request handler
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({products}));

});

router.post('/admin/products/new',
    upload.single('image'),
    [requireTitle, requirePrice],
    handleErrors(productsNewTemplate),
    async (req, res) => {

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