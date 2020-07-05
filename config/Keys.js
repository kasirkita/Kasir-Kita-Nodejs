var Storage = require('node-storage');
const store = new Storage('../../config/database')
const database = store.get('database')
let mongoURI

if (store.get('database')) {

    if (database.username === '' || database.password === '') {
        mongoURI = `mongodb://${database.host}:${database.port}/kasirkita`
    } else {
        mongoURI = `mongodb://${database.username}:${database.password}@${database.host}:${database.port}/kasirkita?authSource=admin`
    }

} else {
    mongoURI = `mongodb://localhost:27017/kasirkita`
}

module.exports = {
    mongoURI
}