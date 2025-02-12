import { pool } from "../src/mysql.conector.js";
import { eliminarAnimalPorNumero } from "./animalModel.js";


export const insertarSalida = async (id_ternero, num_ternero, sexo, peso_inicial, peso_final, propietario, edad, fechad, fechas, csalida, observacion, dueno) => {
  try {
    const fechaObj = new Date(fechas);
    const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opcionesFecha);

    const query = 'INSERT INTO `salidas` (`id_ternero`, `num_ternero`, `sexo`, `peso_inicial`, `peso_final`, `propietario`, `edad`, `fecha_destete`, `fecha_salida`, `causa_salida`, `observacion`, `dueno`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    const [queryResult] = await pool.query(query, [id_ternero, num_ternero, sexo, peso_inicial, peso_final, propietario, edad, fechad, fechaFormateada, csalida, observacion, dueno]);

    if (queryResult.affectedRows > 0) {
      console.log('✅ Salida insertada correctamente.');

      // Llamar a la función de eliminación y mostrar el resultado
      const eliminacionExitosa = await eliminarAnimalPorNumero(num_ternero, dueno);
      console.log('Resultado de eliminación:', eliminacionExitosa);

      if (eliminacionExitosa) {
        console.log('✅ Animal eliminado correctamente después de la salida.');
      } else {
        console.log('⚠️ No se encontró el animal para eliminar.');
      }
    } else {
      console.error('❌ Error al insertar la salida.');
      throw new Error('Error al insertar la salida en la base de datos.');
    }
  } catch (error) {
    console.error('❌ Error en insertarSalida:', error);
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

