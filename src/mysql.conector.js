import mysql from 'mysql';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } from './config.js';

const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    port: DB_PORT, // No es necesario usar comillas para el número del puerto
    password: DB_PASSWORD,
    database: DB_NAME
});

// Manejo de eventos de conexión y errores
pool.on('connection', () => {
    console.log('Conexión establecida con la base de datos');
});

pool.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
});

export { pool };
