const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');
const PORT = process.env.PORT || 3000;


const app = express();
app.use(express.static('public'));

// To avoid copy paste bodyParser in every router
// body Parser transform byte representation of req options to object and puts it to req body
//bodyParser do not applies to GET requests
// Every router handler will be body parsed
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ['qwerty']
}));

app.use(authRouter);
app.use(productsRouter);

app.listen(PORT, () => {
    console.log(`Listening on port: ${ PORT }`);
});