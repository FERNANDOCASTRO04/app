import * as salidasModel from '../modelo/salidasModel.js';

export const insertarSalida = async (req, res) => {
    

    const { id_ternero, num_ternero, sexo, peso_inicial, peso_final,propietario, edad, fechad, fechas, csalida, observacion } = req.body;
    console.log('Esto es lo que viene en el body:',req.body);

  try {
    const dueno = req.session.userId;
    // Llama al modelo para insertar la salida asociada al usuario
    const nuevaSalida = await salidasModel.insertarSalida( id_ternero, num_ternero, sexo, peso_inicial, peso_final,propietario, edad, fechad, fechas, csalida, observacion, dueno);


    console.log(nuevaSalida);

    if (nuevaSalida) {
      console.log('Salida insertada correctamente');
      res.redirect('/salidas'); // Redirige a la página principal o a donde sea apropiado
    } else {
      console.log('Salida insertada correctamente');
      res.redirect('/salidas')
    }
  } catch (error) {
    console.error('Error al insertar la salida:', error);
    res.status(500).send('Error interno del servidor');
  }
};

export const mostrarSalidas = async (req, res) => {
    try {
        // Obtén el ID del usuario autenticado desde la sesión
        const userId = req.session.userId;

        // Llama al modelo para obtener los animales del usuario con información del dueño
        const salidas = await salidasModel.getSalidassByUserId(userId);

        // Renderiza la vista con los resultados
        console.log(salidas);
        if (res && res.render) {
            res.render('salidas', { vacas });
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
