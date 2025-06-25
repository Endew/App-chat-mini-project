import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    },
});

db.raw('SELECT 1')
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });

export default db;