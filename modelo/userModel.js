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
const authenticateUser = async (email, contrasena) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            const query = 'SELECT id, nom_usuario, contrasena, rol FROM usuarios WHERE correo = ?';
            connection.query(query, [email], async (err, results) => {
                connection.release();

                if (err) {
                    reject(err);
                }

                if (results.length > 0) {
                    const userId = results[0].id;
                    const nombreUsuario = results[0].nom_usuario;
                    const storedPassword = results[0].contrasena;
                    const userRole = results[0].rol;

                    const passwordMatch = await bcrypt.compare(contrasena, storedPassword);

                    if (passwordMatch) {
                        // Ahora, en función del rol del usuario, puedes determinar las acciones que puede realizar
                        if (userRole === 'admin') {
                            // Si es un administrador, puedes devolver un objeto que indique que es admin
                            resolve({ userId, nombreUsuario, isAdmin: true });
                        } else {
                            // Si no es admin, devuelves simplemente el userId y nombreUsuario
                            resolve({ userId, nombreUsuario });
                        }
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

const generateResetToken = async (correo) => {
    try {
        const randomString = Math.random().toString(36).substring(2, 15);
        const resetTokenObject = await bcrypt.hash(correo + randomString, saltRounds);
        const resetTokenString = resetTokenObject.toString();
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 1);

        console.log('Generando token para:', correo);
        console.log('Token generado en cadena:', resetTokenString);
        console.log('Fecha de expiración del token:', expirationTime);

        // Resto del código
        const connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });

        const query = 'UPDATE usuarios SET reset_token = ?, reset_token_expiration = ? WHERE correo = ?';
        await new Promise((resolve, reject) => {
            connection.query(query, [resetTokenString, expirationTime, correo], (err, result) => {
                connection.release();
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        console.log('Token generado en cadena:', resetTokenString);
        return resetTokenString;
    } catch (error) {
        console.error('Error al generar el token:', error);
        throw error;
    }

       
   
};

// Restablecer la contraseña con un token válido
const resetPassword = async (resetToken, newPassword) => {
    try {
        const connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });

        const currentTime = new Date().getTime();
        console.log('Restableciendo contraseña para el token:', resetToken);
        console.log('Nueva contraseña:', newPassword);
        const query = 'UPDATE usuarios SET contrasena = ?, reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = ? AND reset_token_expiration > ?';
        await new Promise(async (resolve, reject) => {
            connection.query(query, [await bcrypt.hash(newPassword, saltRounds), resetToken, currentTime], (err, result) => {
                connection.release();
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        console.log('Contraseña restablecida con éxito');
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        throw error;
    }
};

const getUserByResetToken = async (correo, resetToken) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            const currentTime = Date.now();

            const query = 'SELECT * FROM usuarios WHERE correo = ? AND reset_token = ? AND reset_token_expiration > ?';
            connection.query(query, [correo, resetToken, currentTime], (err, results) => {
                connection.release();

                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        reject('Token inválido o expirado');
                    }
                }
            });
        });
    });
};
const getUsers = async () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM usuarios`;

        pool.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};








export { getUserById, authenticateUser, getAnimalesByUserId, getUserByEmail,
    generateResetToken,
    resetPassword,
    getUserByResetToken, getUsers };