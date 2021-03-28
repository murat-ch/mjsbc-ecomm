const express = require('express');
const { handleErrors } = require('./middleware');
const userRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation,
        requireEmailExists, requireValidPassword } = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post('/signup',
    [ requireEmail, requirePassword, requirePasswordConfirmation ],
    handleErrors(signupTemplate),

    async (req, res) => {
        const { email, password } = req.body;

        // Create a user in our repo to represent this person
        const user = await userRepo.create({ email, password });

        // Store the id of that user inside the users cookie
        /// Added by cookie session! > req.session === {}
        req.session.userId = user.id;

        res.send('Account created');
    });

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are log out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
})

router.post('/signin',
    [ requireEmailExists, requireValidPassword ],
    handleErrors(signinTemplate),
    async (req, res) => {

    const { email } = req.body;
    const user = await userRepo.getOneBy({ email });
    req.session.userId = user.id;
    res.send('You are signed in!!!');
});

module.exports = router;