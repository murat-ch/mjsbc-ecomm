const express = require('express');
const bodyParser = require('body-parser');
const userRepo = require('./repositories/users');
const cookieSession = require('cookie-session');

const app = express();

// To avoid copy paste bodyParser in every router
// body Parser transform byte representation of req options to object and puts it to req body
//bodyParser do not applies to GET requests
// Every router handler will be body parsed
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ['qwerty']
}));

app.get('/signup', (req, res) => {
    res.send(`
    <div>
    Your Id is: ${req.session.userId}
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
app.post('/signup',async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await userRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('email in use');
    }
    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    // Create a user in our repo to represent this person
    const user = await userRepo.create({ email, password });

    // Store the id of that user inside the users cookie
    /// Added by cookie session! > req.session === {}
    req.session.userId = user.id;

    res.send('Account created');
});

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are log out');
});

app.get('signin', (req, res) => {
    res.send(`
    <div>
    <form method="post">
        <input name="email" placeholder="email"/>
        <input name="password" placeholder="password"/>
    <button>Sign In</button>
    </form>
    </div>
    `);
})

app.post('/signin', async (req, res) => {

});

app.listen(3000, () => {
    console.log('Listening');
});