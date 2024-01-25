import * as animalModel from '../modelo/animalModel.js'

//insertar animal
export const insertarAnimal = async (req, res) => {
    const { num_ternero, sexo, color, peso, madre, userId, propietario,  fecha, observaciones /* otros campos del formulario */ } = req.body;

    try {
        const userId = req.session.userId;
        const dueno = req.session.userId;
        // Verificar si el correo electrónico ya existe
        const existingUser = await animalModel.getNumByuserId(num_ternero, dueno);
        if (existingUser) {
            // El correo electrónico ya existe, devuelve una respuesta de error
            return res.render('agregaranimal', { message: 'Este numero de animal ya esta registrado' });
        }

        // El correo electrónico no existe, proceder con la creación del usuario
        const result = await animalModel.insertarAnimal(num_ternero, sexo, color, peso, madre, userId, propietario, fecha, observaciones);
        if (result) {
            console.log('Animal insertado correctamente');
            res.redirect('/animales');
        } else {
            res.status(500).send('Error interno del servidor');
        }
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

//eliminar animal

export const eliminarAnimal = async (req, res) => {
    try {
        const { num_ternero } = req.body;
        const dueno = req.session.userId;
        const eliminacionExitosa = await animalModel.eliminarAnimalPorNumero(num_ternero, dueno);

        if (eliminacionExitosa) {
            console.log('Animal eliminado correctamente');
            res.redirect('/animales');
        } else {
           res.redirect('/animales');
        }
    } catch (error) {
        console.error('Error al procesar la eliminación del animal:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const editarAnimal = async (req, res) => {
    try {
        const {sexo, color, peson, propietario, observacion, id_ternero } = req.body;
        const dueno = req.session.userId;

        const eliminacionExitosa = await animalModel.editarAnimalPorNumero(sexo, color, peson, propietario, observacion , id_ternero, dueno);

        if (eliminacionExitosa) {
            console.log('Animal editado correctamente');
            res.redirect('/animales');
        } else {
           res.redirect('/animales');
        }
    } catch (error) {
        console.error('Error al procesar la eliminación del animal:', error);
        res.status(500).send('Error interno del servidor');
    }
};
