import { pool } from "../src/mysql.conector.js";


export const insertarCompra = async (num, color, fecha, pesoe, userId, propietario) => {
    try {
        const fechaObj = new Date(fecha);
        

        // Formatear la fecha en español
        const opcionesFecha = {
            weekday: 'long', // día de la semana (Lunes)
            day: 'numeric', // día del mes (18)
            month: 'long', // nombre del mes (marzo)
            year: 'numeric' // año (2024)
        };
      const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opcionesFecha);
        const query = 'INSERT INTO compras (id_compra, num_ternero, color, fecha_compra, peso_entrada,  dueno, propietario) VALUES (?, ?, ?, ?, ?, ?, ?)';

        const queryResult = await pool.query(query, [null,num, color, fechaFormateada, pesoe, userId, propietario]);
            console.log(queryResult);
        // Verificamos que queryResult tenga una propiedad insertId
        if (queryResult && queryResult!== undefined) {
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



export const getCompraByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT 
        compras.*, 
        usuarios.nom_usuario as nombre_dueno,
        compras.num_ternero
    FROM 
        compras
    INNER JOIN 
        usuarios ON compras.dueno = usuarios.id
    WHERE 
        compras.dueno = ?;
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

export const getComByuserId = async (num, dueno) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            const query = 'SELECT * FROM compras WHERE num_ternero = ? AND dueno = ?';
            connection.query(query, [num, dueno], (err, results) => {
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


export const insertarSalida_Compra = async (  id_compra, num, color, fechac, fechas, pesoe, pesos, csalida, propietario, observacion, dueno ) => {
    try {
        const fechaObj = new Date(fechas);
        

        // Formatear la fecha en español
        const opcionesFecha = {
            weekday: 'long', // día de la semana (Lunes)
            day: 'numeric', // día del mes (18)
            month: 'long', // nombre del mes (marzo)
            year: 'numeric' // año (2024)
        };
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opcionesFecha);
      // Insertar la salida en la base de datos
      const query = 'INSERT INTO `salidas_compras` (`id_compra`, `num_ternero`, `color`, `fecha_compra`, `fecha_salida`, `peso_entrada`, `peso_salida`, `causa_salida`,`propietario`, `observacion`, `dueno`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const queryResult = await pool.query(query, [ id_compra, num, color, fechac, fechaFormateada, pesoe, pesos, csalida, propietario, observacion, dueno]);
      // Verificar que queryResult tenga una propiedad insertId
      console.log(queryResult);
      if (queryResult && queryResult) {
        // Eliminar el animal de la lista
        const eliminacionExitosa = await eliminarCompraPorNumero(dueno, num);
  
        if (eliminacionExitosa) {
          console.log('Animal eliminado correctamente');
        } else {
          console.log('Error al eliminar el animal');
        }
  
        // Resto del código...
      } else {
        console.error('Error al insertar la salida en el modelo: Propiedad insertId no encontrada en queryResult');
        throw new Error('Error al insertar la salida en el modelo: Propiedad insertId no encontrada en queryResult');
      }
    } catch (error) {
      console.error('Error al insertar la salida en el modelo:', error);
      throw error;
    }
};

export const eliminarCompraPorNumero = async (dueno, num_ternero) => {
    const query = 'DELETE FROM `compras` WHERE dueno = ? AND num_ternero = ?';

    try {
        console.log('Consulta SQL:', query);
        console.log('Valores:', [dueno, num_ternero]);
        
        const queryResult = await pool.query(query, [dueno, num_ternero]);
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


export const getSalidasComprasByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM salidas_compras WHERE dueno = ?';

        pool.query(query, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

export const editarCompraPorNumero = async (color, fechac, pesoe, propietario,  id_compra,  dueno) => {
    const query = 'UPDATE compras SET color = ?, fecha_compra = ?, peso_entrada = ?, propietario = ? WHERE compras.id_compra = ?  AND dueno = ?';

    try {
        console.log('Consulta SQL:', query);
        console.log('Valores:', [color, fechac, pesoe, propietario, id_compra,  dueno]);
        
        const queryResult = await pool.query(query, [color, fechac, pesoe, propietario, id_compra,  dueno]);
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