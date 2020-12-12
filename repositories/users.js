const fs = require('fs');
const crypto = require('crypto');

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

    async create(attrs) {
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        //write the updated 'records' array back to this.filename
        await this.writeAll(records);
        return attrs;
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
