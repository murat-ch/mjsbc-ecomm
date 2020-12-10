const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// To avoid copy paste bodyParser in every router
// body Parser transform byte representation of req options to object and puts it to req body
//bodyParser do not applies to GET requests
// Every router handler will be body parsed
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send(`
    <div>
    <form method="post">
        <input name="email" placeholder="email"/>
        <input name="password" placeholder="password"/>
        <input name="passwordConfirmation" placeholder="password confirmation"/>
    <button>Sign up</button>
    </form>
    </div>
    `);
});



// Move middleware function to app.use()
app.post('/',(req, res) => {
    console.log(req.body);
    res.send('Account created');
});

app.listen(3000, () => {
    console.log('Listening');
});





