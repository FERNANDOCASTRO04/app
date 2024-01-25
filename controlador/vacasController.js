import * as vacasModel from '../modelo/vacasModel.js';

export const agregarVaca = async (req, res) => {
    const { numvaca, nomvaca, propietario, observacion } = req.body;
  
    try {
        const userId = req.session.userId;
        // Verificar si el correo electrónico ya existe
        const existingvaca = await vacasModel.getvacaByuserId(numvaca, userId);
        if (existingvaca) {
            // El correo electrónico ya existe, devuelve una respuesta de error
            return res.render('agregarvacas', { message: 'Este numero de animal ya esta registrado' });
        }
  
      // Llama al modelo para insertar la vaca asociada al usuario
      await vacasModel.insertarVaca(numvaca, nomvaca, userId, propietario, observacion);
  
      console.log('Vaca insertada correctamente');
      res.redirect('/vacas'); // Puedes redirigir a la página principal o a donde sea apropiado
    } catch (error) {
      console.error('Error al insertar la vaca:', error);
      res.status(500).send('Error interno del servidor');
    }
};

const mostrarVacas = async (req, res) => {
    try {
        // Obtén el ID del usuario autenticado desde la sesión
        const userId = req.session.userId;

        // Llama al modelo para obtener los animales del usuario con información del dueño
        const vacas = await vacasModel.getVacasByUserId(userId);

        // Renderiza la vista con los resultados
        console.log(vacas);
        if (res && res.render) {
            res.render('agregaranimal', { vacas });
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



export const eliminarVaca = async (req, res) => {
    try {
        const { num_vaca } = req.body;
        const dueno = req.session.userId;

        const eliminacionExitosa = await vacasModel.eliminarVacaPorNumero(dueno, num_vaca);

        if (eliminacionExitosa) {
            console.log('Vaca eliminada correctamente');
            res.redirect('/vacas');
        } else {
           res.redirect('/vacas');
        }
    } catch (error) {
        console.error('Error al procesar la eliminación del animal:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const editarVaca = async (req, res) => {
    try {
        const {nombre_vaca, propietario, observacion, id_vaca } = req.body;
        const dueno = req.session.userId;

        const eliminacionExitosa = await vacasModel.editarVacaPorNumero(nombre_vaca, propietario, observacion, id_vaca, dueno);

        if (eliminacionExitosa) {
            console.log('Vaca editada correctamente');
            res.redirect('/vacas');
        } else {
           res.redirect('/vacas');
        }
    } catch (error) {
        console.error('Error al procesar la eliminación del animal:', error);
        res.status(500).send('Error interno del servidor');
    }
};


export { mostrarVacas };
