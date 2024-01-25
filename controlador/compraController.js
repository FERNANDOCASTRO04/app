import * as compraModel from '../modelo/compraModel.js'


//insertar animal
export const insertarCompra = async (req, res) => {
    const { num, color, fecha, pesoe, userId, propietario /* otros campos del formulario */ } = req.body;

    try {
        const userId = req.session.userId;
        const dueno = req.session.userId;
        // Verificar si el correo electrónico ya existe
        const existingUser = await compraModel.getComByuserId(num, dueno);
        if (existingUser) {
            // El correo electrónico ya existe, devuelve una respuesta de error
            return res.render('agregarternerocompra', { message: 'Este numero de animal ya esta registrado' });
        }

        // El correo electrónico no existe, proceder con la creación del usuario
        const result = await compraModel.insertarCompra(num, color, fecha, pesoe,  userId, propietario);
        if (result) {
            console.log('Compra insertado correctamente');
            res.redirect('/terneroscompra');
        } else {
            res.status(500).send('Error interno del servidor');
        }
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const mostrarCompras = async (req, res) => {
    try {
        // Obtén el ID del usuario autenticado desde la sesión
        const userId = req.session.userId;

        // Llama al modelo para obtener los animales del usuario con información del dueño
        const compras = await compraModel.getCompraByUserId(userId);

        // Renderiza la vista con los resultados
        console.log(compras)
        res.render('terneroscompra', { compras });
    } catch (error) {
        console.error('Error al obtener animales del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};


export const insertarSalida_Compra = async (req, res) => {
    

    const { id_compra, num, color, fechac, fechas, pesoe, pesos, csalida, propietario, observacion, dueno} = req.body;
    console.log('Esto es lo que viene en el body:',req.body);

  try {
    const dueno = req.session.userId;
    // Llama al modelo para insertar la salida asociada al usuario
    const nuevaSalida = await compraModel.insertarSalida_Compra( id_compra, num, color, fechac, fechas, pesoe, pesos, csalida, propietario, observacion, dueno);


    console.log(nuevaSalida);

    if (nuevaSalida) {
      console.log('Salida insertada correctamente');
      res.redirect('/salidas_compras'); // Redirige a la página principal o a donde sea apropiado
    } else {
      console.log('Salida insertada correctamente');
      res.redirect('/salidas_compras')
    }
  } catch (error) {
    console.error('Error al insertar la salida:', error);
    res.status(500).send('Error interno del servidor');
  }
};

export const eliminarcompra = async (req, res) => {
    try {
        const { num } = req.body;
        const dueno = req.session.userId;

        const eliminacionExitosa = await compraModel.eliminarCompraPorNumero(dueno, num);

        if (eliminacionExitosa) {
            console.log('Compra eliminada correctamente');
            res.redirect('/vacas');
        } else {
           res.redirect('/vacas');
        }
    } catch (error) {
        console.error('Error al procesar la eliminación del animal:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const mostrarSalidasCompras = async (req, res) => {
    try {
        // Obtén el ID del usuario autenticado desde la sesión
        const userId = req.session.userId;
  
        // Llama al modelo para obtener los animales del usuario con información del dueño
        const salidasCompras = await compraModel.getSalidasComprasByUserId(userId);
  
        // Renderiza la vista con los resultados
        console.log(salidasCompras);
        if (res && res.render) {
            res.render('salidas_compras');
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


export const editarCompra = async (req, res) => {
    try {
        const {color, fechac, pesoe, propietario, id_compra} = req.body;
        const dueno = req.session.userId;

        const edicionExitosa = await compraModel.editarCompraPorNumero(color, fechac, pesoe, propietario, id_compra, dueno);

        if (edicionExitosa) {
            console.log('Compra editada correctamente');
            res.redirect('/terneroscompra');
        } else {
           res.redirect('/terneroscompra');
        }
    } catch (error) {
        console.error('Error al procesar la eliminación del animal:', error);
        res.status(500).send('Error interno del servidor');
    }
};
