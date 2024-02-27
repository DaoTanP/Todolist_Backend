require('dotenv').config();
const { DataSource } = require('typeorm');
const Task = require('./entities/task');

const mySqlDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Task],
    synchronize: true, // automatically create table if not exists
});

mySqlDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!')
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err)
    });

module.exports = mySqlDataSource;