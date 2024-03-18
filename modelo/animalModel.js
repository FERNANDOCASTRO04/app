// animalModel.js
import { pool } from '../src/mysql.conector.js';


export const insertarAnimal = async (num_ternero, sexo, color, peso, madre, userId, propietario, fecha, observaciones) => {
    try {
        // Convertir fecha a un objeto Date si no lo es
        const fechaObj = new Date(fecha);
        fechaObj.setDate(fechaObj.getDate() + 1);

        // Formatear la fecha en español
        const opcionesFecha = {
            weekday: 'long', // día de la semana (Lunes)
            day: 'numeric', // día del mes (18)
            month: 'long', // nombre del mes (marzo)
            year: 'numeric' // año (2024)
        };
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opcionesFecha);

        const query = 'INSERT INTO terneros (id_ternero, num_ternero, sexo, color_cria, peso_nacimiento, madre_cria, dueno, propietario, fecha_nacimiento, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?)';

        const queryResult = await pool.query(query, [null, num_ternero, sexo, color, peso, madre, userId, propietario, fechaFormateada, observaciones]);
        
        console.log(queryResult);

        // Verificamos que queryResult tenga una propiedad insertId
        if (queryResult && queryResult) {
            const nuevoAnimalId = queryResult;
            return nuevoAnimalId;
        } else {
            console.error('Error al insertar el animal en el modelo: Propiedad insertId no encontrada en queryResult');
            throw new Error('Error al insertar el animal en el modelo: Propiedad insertId no encontrada en queryResult');
        }
    } catch (error) {
        console.error('Error al insertar el animal en el modelo:', error);
        throw error;
    }
};



// Eliminar animal
export const eliminarAnimalPorNumero = async (num_ternero, dueno) => {
    const query = 'DELETE FROM terneros WHERE num_ternero = ? AND dueno = ?';

    try {
        console.log('Consulta SQL:', query);
        console.log('Valores:', [num_ternero, dueno]);
        
        const queryResult = await pool.query(query, [num_ternero, dueno]);
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


export const getNumByuserId = async (num_ternero, dueno) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            const query = 'SELECT * FROM terneros WHERE num_ternero = ? AND dueno = ?';
            connection.query(query, [num_ternero, dueno], (err, results) => {
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


    export const editarAnimalPorNumero = async (sexo, color, peson, propietario, observacion, id_ternero, dueno) => {
        const query = 'UPDATE terneros SET sexo = ?, color_cria = ?, peso_nacimiento = ?, propietario = ?, observaciones = ? WHERE terneros.id_ternero = ? AND terneros.dueno = ?';

        try {
            console.log('Consulta SQL:', query);
            console.log('Valores:', [sexo, color, peson, propietario, observacion , id_ternero, dueno]);
            
            const queryResult = await pool.query(query, [sexo, color, peson, propietario, observacion,id_ternero, dueno]);
            console.log(queryResult);
            if (queryResult.affectedRows > 0) {
                return true; // Éxito al eliminar el animal
            } else {
                console.log('animal editado correctamente');
                return true; // No se encontró el animal con el número de ternero especificado
            }
        } catch (error) {
            console.error('Error al eliminar el animal:', error);
            throw error;
        }
    };