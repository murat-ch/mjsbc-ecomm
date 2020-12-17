const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

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

app.listen(3000, () => {
    console.log('Listening');
});