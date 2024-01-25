// userController.js
import * as userModel from '../modelo/userModel.js';

//CREAR USUARIO
export const createUser = async (req, res) => {
    const { nom_usuario, correo, contrasena } = req.body;

    try {
        // Verificar si el correo electrónico ya existe
        const existingUser = await userModel.getUserByEmail(correo);
        if (existingUser) {
            // El correo electrónico ya existe, devuelve una respuesta de error
            return res.render('registrarse', { message: 'Este correo ya esta registrado' });
        }

        // El correo electrónico no existe, proceder con la creación del usuario
        const result = await userModel.createUser(nom_usuario, correo, contrasena);
        if (result) {
            console.log('Usuario insertado correctamente');
            res.redirect('/login');
        } else {
            res.status(500).send('Error interno del servidor');
        }
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};
//INICIAR SESION
const loginUser = async (req, res) => {
    const { nom_usuario, contrasena } = req.body;

    try {
        const userId = await userModel.authenticateUser(nom_usuario, contrasena);

        // Almacenar el id del usuario en la sesión
        req.session.authenticated = true;
        req.session.userId = userId;
        req.session.nom_usuario = nom_usuario;

        console.log('Inicio de sesión exitoso');
        res.redirect('/paginaprincipal');
    } catch (error) {
        console.error('Error al verificar el usuario e iniciar sesión: ' + error);
        res.render('login', { message: '' + error });
        
    }
};

//MOSTAR ANIMALES
const mostrarAnimales = async (req, res) => {
    try {
        // Obtén el ID del usuario autenticado desde la sesión
        const userId = req.session.userId;

        // Llama al modelo para obtener los animales del usuario con información del dueño
        const animales = await userModel.getAnimalesByUserId(userId);

        // Renderiza la vista con los resultados
        console.log(animales)
        res.render('animales', { animales });
    } catch (error) {
        console.error('Error al obtener animales del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};


export { mostrarAnimales, loginUser };