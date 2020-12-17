module.exports = {
    getError (errors, prop) {
        // prop === 'email' || 'password' || 'passwordConfirmation'
            try {
                return errors.mapped()[prop].msg
            } catch (err) {
                // if no errors - do nothing
                return '';
            }
            /*
            errors.mapped() === {
            email: {
             value: 'qwerty',
             msg: 'qwerty'
             param: 'qwerty',
             location: 'qwerty'
             },
            password: {},
            passwordConfirmation: {}
            }
             */
        }
}