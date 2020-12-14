const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        // Open the file
        // Parse the contents
        // Return the parsed data

        return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
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

    // Saves -> password saves in our database
    // Supplied -> password given t ous by a user trying sign in
    async comparePasswords(saved, supplied) {
        const [hashed, salt] = saved.split('.');
        const hashBuffer  =await scrypt(supplied, salt, 64);
        return hashed === hashBuffer.toString('hex');
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        let records = await this.getAll();
        return records.find(user => user.id === id);
    }

    async update(id, attrs) {
        let records = await this.getAll();
        let user = records.find(user => user.id === id);
        if (!user) {
            throw new Error(`User Id with ${id} not found`);
        }
        Object.assign(user, attrs);
        await this.writeAll(records);
    }



    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(user => user.id !== id);
        await this.writeAll(filteredRecords);
    }

    async getOneBy(filters) {
        const records = await this.getAll();
        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }

        }
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
