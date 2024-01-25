import { pool } from '../src/mysql.conector.js';

export const insertarVaca = async (numvaca, nomvaca, userId, propietario, observacion) => {
    try {
      const query = 'INSERT INTO vacas (num_vaca, nombre_vaca, dueno, propietario, observacion) VALUES (?, ?, ?, ?, ?)';
  
      const queryResult = await pool.query(query, [numvaca, nomvaca, userId, propietario, observacion]);
        console.log(queryResult);
      // Verificamos que queryResult tenga una propiedad insertId
      if (queryResult && queryResult !== undefined) {
        const nuevaVacaId = queryResult;
        return nuevaVacaId;
      } else {
        console.error('Error al insertar la vaca en el modelo: Propiedad insertId no encontrada en queryResult');
        throw new Error('Error al insertar la vaca en el modelo: Propiedad insertId no encontrada en queryResult');
      }
    } catch (error) {
      console.error('Error al insertar la vaca en el modelo:', error);
      throw error;
    }
};
  


const getVacasByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT 
        vacas.*, 
        usuarios.nom_usuario as nombre_dueno
    FROM 
        vacas
    INNER JOIN 
        usuarios ON vacas.dueno = usuarios.id
    WHERE 
        vacas.dueno = ?`;

        pool.query(query, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
                console.log(results);
            }
        });
    });
};

export const eliminarVacaPorNumero = async (dueno, num_vaca) => {
    const query = 'DELETE FROM vacas WHERE dueno = ? AND num_vaca = ?';

    try {
        console.log('Consulta SQL:', query);
        console.log('Valores:', [num_vaca, dueno]);
        
        const queryResult = await pool.query(query, [dueno, num_vaca]);
        console.log(queryResult);
        if (queryResult.affectedRows > 0) {
            return true; // Éxito al eliminar el animal
        } else {
            console.log('animal eliminado correctamente');
            return true; // No se encontró el animal con el número de ternero especificado
        }
    } catch (error) {
        console.error('Error al eliminar el animal:', error);
        throw error;
    }
};

export const getvacaByuserId = async (numvaca, userId) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            const query = 'SELECT vacas.*, usuarios.nom_usuario as nombre_dueno  FROM vacas   INNER JOIN usuarios ON vacas.dueno = usuarios.id   WHERE vacas.num_vaca = ? AND vacas.dueno = ?';
            connection.query(query, [numvaca, userId], (err, results) => {
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



export const editarVacaPorNumero = async (nombre_vaca, propietario, observacion, id_vaca, dueno) => {
    const query = 'UPDATE vacas SET nombre_vaca = ?, propietario = ?, observacion = ? WHERE vacas.id_vaca = ? AND vacas.dueno = ?';

    try {
        console.log('Consulta SQL:', query);
        console.log('Valores:', [nombre_vaca, propietario, observacion, id_vaca, dueno]);
        
        const queryResult = await pool.query(query, [nombre_vaca, propietario, observacion, id_vaca, dueno]);
        console.log(queryResult);
        if (queryResult.affectedRows > 0) {
            return true; // Éxito al eliminar el animal
        } else {
            console.log('animal eliminado correctamente');
            return true; // No se encontró el animal con el número de ternero especificado
        }
    } catch (error) {
        console.error('Error al eliminar el animal:', error);
        throw error;
    }
};

export {getVacasByUserId}
