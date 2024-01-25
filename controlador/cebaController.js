import * as cebaModel from '../modelo/cebaModel.js'


export const insertarCeba = async (req, res) => {
    

    const {id_ternero, num_ternero, sexo, peso_inicial, fecha_destete, madre_cria, userId, propietario, observacion } = req.body;
    console.log('Esto es lo que viene en el body:',req.body);

  try {
    const userId = req.session.userId;
    const dueno = req.session.userId;
    // Verificar si el correo electrónico ya existe
    const existingUser = await cebaModel.getNumByuserId(dueno, num_ternero);
    if (existingUser) {
        // El correo electrónico ya existe, devuelve una respuesta de error
        return res.redirect(302, '/animales?message=Este%20numero%20de%20animal%20ya%20esta%20en%20ceba');

    }
    // Llama al modelo para insertar la salida asociada al usuario
    const nuevaCeba = await cebaModel.insertarCeba(id_ternero, num_ternero, sexo, peso_inicial, fecha_destete, madre_cria, userId, propietario, observacion);


    console.log(nuevaCeba);

    if (nuevaCeba) {
      console.log('Ceba insertada correctamente');
      res.redirect('/terneros-ceba'); // Redirige a la página principal o a donde sea apropiado
    } else {
      console.log('Ceba insertada correctamente');
      res.redirect('/terneros-ceba')
    }
  } catch (error) {
    console.error('Error al insertar la salida:', error);
    res.status(500).send('Error interno del servidor');
  }
};


export const mostrarCeba = async (req, res) => {
  try {
    // Obtén el ID del usuario autenticado desde la sesión
    const userId = req.session.userId;

    // Llama al modelo para obtener los animales del usuario con información del dueño
    const cebas = await cebaModel.getCebaByUserId(userId);

    // Renderiza la vista con los resultados
    console.log(cebas);
    if (res && res.render) {
      res.render('terneros-ceba', { cebas }); // Pasa los datos a la vista
    } else {
      console.error('La variable res no está definida o no tiene la propiedad render');
    }
  } catch (error) {
    if (res && res.status) {
      res.status(500).send('Error interno del servidor');
    } else {
      console.error('La variable res no está definida o no tiene la propiedad status');
    }
  }
};
