import { pool } from "../src/mysql.conector.js";

export const insertarCeba = async (id_ternero, num_ternero, sexo, peso_inicial, fecha_destete, madre_cria, userId, propietario, observacion, ) => {
    try {
        // Convertir fecha a un objeto Date si no lo es
        const fechaObj = new Date(fecha_destete);
        

        // Formatear la fecha en español
        const opcionesFecha = {
            weekday: 'long', // día de la semana (Lunes)
            day: 'numeric', // día del mes (18)
            month: 'long', // nombre del mes (marzo)
            year: 'numeric' // año (2024)
        };
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opcionesFecha);
      // Insertar la salida en la base de datos
      const query = 'INSERT INTO `terneros_seva` (`id_ter`, `num_ternero`, `sexo`,  `peso_inicial`, `fecha_destete`, `madre_cria`, `dueno`, `propietario`, `observacion`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const queryResult = await pool.query(query, [id_ternero, num_ternero, sexo, peso_inicial, fechaFormateada, madre_cria, userId, propietario, observacion]);
        console.log(queryResult);
      // Verificar que queryResult tenga una propiedad insertId
    } catch (error) {
      console.error('Error al insertar la salida en el modelo:', error);
      throw error;
    }
};

export const getCebaByUserId = async (userId) => {
  return new Promise((resolve, reject) => {
      const query = `SELECT 
      terneros_seva.*, 
      usuarios.nom_usuario as nombre_dueno,
      vacas.nombre_vaca as nombre_madre,
      vacas.num_vaca as num_vaca
      
  FROM 
      terneros_seva
  INNER JOIN 
      usuarios ON terneros_seva.dueno = usuarios.id
  INNER JOIN 
      vacas ON terneros_seva.madre_cria = vacas.id_vaca AND vacas.num_vaca

  WHERE 
      terneros_seva.dueno = ?`;

      pool.query(query, [userId], (err, results) => {
          if (err) {
              reject(err);
          } else {
              resolve(results);
          }
      });
  });
};
  


export const getNumByuserId = async (dueno, num_ternero) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }

            const query = 'SELECT * FROM terneros_seva WHERE dueno = ? AND num_ternero = ?';
            connection.query(query, [dueno, num_ternero], (err, results) => {
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