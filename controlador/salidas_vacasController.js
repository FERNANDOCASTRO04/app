import * as salidas_vacasModel from '../modelo/salidas_vacasModel.js'




export const insertarSalida_vaca = async (req, res) => {
    

    const { id_vaca, num_vaca, nombre_vaca, peso_final, fechas, propietario, csalida, observacion, dueno} = req.body;
    console.log('Esto es lo que viene en el body:',req.body);

  try {
    const dueno = req.session.userId;
    // Llama al modelo para insertar la salida asociada al usuario
    const nuevaSalida = await salidas_vacasModel.insertarSalida_vaca( id_vaca, num_vaca, nombre_vaca, peso_final, fechas, propietario, csalida, observacion, dueno);


    console.log(nuevaSalida);

    if (nuevaSalida) {
      console.log('Salida insertada correctamente');
      res.redirect('/salidas_vacas'); // Redirige a la página principal o a donde sea apropiado
    } else {
      console.log('Salida insertada correctamente');
      res.redirect('/salidas_vacas')
    }
  } catch (error) {
    console.error('Error al insertar la salida:', error);
    res.status(500).send('Error interno del servidor');
  }
};



export const mostrarSalidasVacas = async (req, res) => {
  try {
      // Obtén el ID del usuario autenticado desde la sesión
      const userId = req.session.userId;

      // Llama al modelo para obtener los animales del usuario con información del dueño
      const salidasVacas = await salidas_vacasModel.getSalidasVacasByUserId(userId);

      // Renderiza la vista con los resultados
      console.log(salidasVacas);
      if (res && res.render) {
          res.render('salidas_vacas');
      } else {
          console.error('La variable res no está definida o no tiene la propiedad render');
      }
      return vacas;
  } catch (error) {
      if (res && res.status) {
          res.status(500).send('Error interno del servidor');
      } else {
          console.error('La variable res no está definida o no tiene la propiedad status');
      }
  }
};