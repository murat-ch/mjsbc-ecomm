const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository{

    // Saves -> password saves in our database
    // Supplied -> password given t ous by a user trying sign in
    async comparePasswords(saved, supplied) {
        const [hashed, salt] = saved.split('.');
        const hashBuffer  =await scrypt(supplied, salt, 64);
        return hashed === hashBuffer.toString('hex');
    }

    // attrs === { email, password }
    async create(attrs) {
        attrs.id = this.randomId();

        // generate salt part
        const salt  = crypto.randomBytes(8).toString('hex');

        // generate hash password
        const buff = await scrypt(attrs.password, salt, 64);
        const record = {
            ...attrs,
            password: `${buff.toString('hex')}.${salt}`,
        };

        const records = await this.getAll();
        records.push(record);
        //write the updated 'records' array back to this.filename
        await this.writeAll(records);
        return record;
    }
}

// const test = async () => {
//     const repo = new UsersRepository('users.json');
//     // await repo.create({ email: 'test@test.com', password: 'password' });
//     // repo.delete('a66656e9');
//     // console.log(users);
//     // const user1 = await repo.getOne('ec8fafae');
//     // console.log(user1);
//     // await repo.update('aded8225', {email: 'cmm@gmail.com', password: 'xyz'});
//     const users = await repo.getAll();
//     console.log(users);
//     const filtered = await repo.getOneBy({
//         id: 'aded8225',
//         // email: 'cmm@gmail.com'
//         // , password: 'xyz'
//     });
//
//     console.log(filtered);
//
// }
// test();

//export instance of repository
module.exports = new UsersRepository('users.json');
