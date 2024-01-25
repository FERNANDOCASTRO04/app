// userModel.js
import { pool } from '../src/mysql.conector.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;
//CREAR USUARIO
export const createUser = async (nom_usuario, correo, contrasena) => {
    try {
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        const connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });

        const query = 'INSERT INTO usuarios (nom_usuario, correo, contrasena) VALUES (?, ?, ?)';
        await new Promise((resolve, reject) => {
            connection.query(query, [nom_usuario, correo, hashedPassword], (err, result) => {
                connection.release();
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        return true;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};
//OBTENER ID USUARIO
const getUserById = async (userId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            const query = 'SELECT * FROM usuarios WHERE id = ?';
            connection.query(query, [userId], (err, results) => {
                connection.release();

                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });
    });
};
//AUTENTICADOR DE USUARIO
const authenticateUser = async (nom_usuario, contrasena) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            const query = 'SELECT id, contrasena FROM usuarios WHERE nom_usuario = ?';
            connection.query(query, [nom_usuario], async (err, results) => {
                connection.release();

                if (err) {
                    reject(err);
                }

                if (results.length > 0) {
                    const userId = results[0].id;
                    const storedPassword = results[0].contrasena;
                    const passwordMatch = await bcrypt.compare(contrasena, storedPassword);

                    if (passwordMatch) {
                        resolve(userId);
                    } else {
                        reject('Contraseña incorrecta');
                    }
                } else {
                    reject('Usuario no encontrado');
                }
            });
        });
    });
};

//BUSCAR ANIMAL POR EL ID DEL USUARIO QUE HA INICIADO SESION 
const getAnimalesByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT 
        terneros.*,
        usuarios.nom_usuario as nombre_dueno,
        vacas.nombre_vaca as nombre_madre,
        vacas.num_vaca as num_vaca,
        terneros.propietario as propietarios
    FROM 
        terneros
    INNER JOIN 
        usuarios ON terneros.dueno = usuarios.id
    INNER JOIN 
        vacas ON terneros.madre_cria = vacas.id_vaca AND vacas.id_vaca
    WHERE 
        terneros.dueno = ?;
        `;

        pool.query(query, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

//OBTENER CORREO USUARIO
const getUserByEmail = async (correo) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            const query = 'SELECT * FROM usuarios WHERE correo = ?';
            connection.query(query, [correo], (err, results) => {
                connection.release();

                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });
    });
}; 

export { getUserById, authenticateUser, getAnimalesByUserId, getUserByEmail };