import { pool } from "../src/mysql.conector.js";
import { eliminarVacaPorNumero } from "./vacasModel.js";




export const insertarSalida_vaca = async ( id_vaca, num_vaca, nombre_vaca, peso_final, fechas, propietario, csalida, observacion, dueno ) => {
    try {
      // Insertar la salida en la base de datos
      const query = 'INSERT INTO `salidas_vacas` (`id_vaca`, `num_vaca`, `nombre_vaca`, `peso_final`, `fecha_salida`,`propietario`, `causa_salida`, `observacion`, `dueno`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const queryResult = await pool.query(query, [ id_vaca, num_vaca, nombre_vaca, peso_final, fechas, propietario, csalida, observacion, dueno]);
      // Verificar que queryResult tenga una propiedad insertId
      console.log(queryResult);
      if (queryResult && queryResult) {
        // Eliminar el animal de la lista
        const eliminacionExitosa = await eliminarVacaPorNumero(dueno, num_vaca);
  
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
  


  export const getSalidasVacasByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM salidas_vacas WHERE dueno = ?';

        pool.query(query, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};