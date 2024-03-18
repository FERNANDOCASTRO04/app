import { pool } from "../src/mysql.conector.js";
import { eliminarAnimalPorNumero } from "./animalModel.js";


export const insertarSalida = async ( id_ternero, num_ternero, sexo, peso_inicial, peso_final,propietario, edad, fechad, fechas, csalida, observacion, dueno ) => {
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
    const query = 'INSERT INTO `salidas` (`id_ternero`, `num_ternero`, `sexo`, `peso_inicial`, `peso_final`,`propietario`, `edad`, `fecha_destete`, `fecha_salida`, `causa_salida`, `observacion`, `dueno`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const queryResult = await pool.query(query, [ id_ternero, num_ternero, sexo, peso_inicial, peso_final,propietario, edad, fechad, fechaFormateada, csalida, observacion, dueno ]);
    // Verificar que queryResult tenga una propiedad insertId
    console.log(queryResult);
    if (queryResult && queryResult) {
      // Eliminar el animal de la lista
      const eliminacionExitosa = await eliminarAnimalPorNumero(num_ternero, dueno);

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


export const getSalidassByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM salidas WHERE dueno = ?`;

        pool.query(query, [userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

