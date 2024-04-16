// userController.js
import JSONTransport from 'nodemailer/lib/json-transport/index.js';
import * as userModel from '../modelo/userModel.js';
import nodemailer from 'nodemailer';

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
    const { email, contrasena } = req.body;

    try {
        const userData = await userModel.authenticateUser(email, contrasena); // Llama a authenticateUser directamente

        // Almacenar la información del usuario en la sesión
        req.session.authenticated = true;
        req.session.userId = userData.userId;
        req.session.nombreUsuario = userData.nombreUsuario; // Almacena el nombre de usuario en la sesión
        req.session.email = email;
        
        // Verificar si el usuario es administrador y establecer la variable de sesión correspondiente
        if (userData.isAdmin) {
            req.session.isAdmin = true;
        } else {
            req.session.isAdmin = false;
        }

        // Ahora puedes verificar si es administrador y redirigir según el rol
        if (userData.isAdmin) {
            console.log('Inicio de sesión exitoso para el administrador');
            res.render('paginadmin', { nombreUsuario: req.session.nombreUsuario });
        } else {
            console.log('Inicio de sesión exitoso');
            res.render('paginaprincipal', { nombreUsuario: req.session.nombreUsuario, isAdmin: req.session.isAdmin });
        }
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
// Solicitar restablecimiento de contraseña
const requestPasswordReset = async (req, res) => {
    const { correo } = req.body;

    try {
        // Genera el token de restablecimiento de contraseña
        const resetTokenString = await userModel.generateResetToken(correo);

        // Envía el correo electrónico con el token
        await sendPasswordResetEmail(req, resetTokenString);

        // Redirige o renderiza la página según sea necesario
        res.render('solicitud', { message: 'Se ha enviado un correo electrónico para restablecer la contraseña' });
    } catch (error) {
        console.error('Error al solicitar el restablecimiento de contraseña:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const sendPasswordResetEmail = async (req, resetTokenString) => {
    // Configura el transporte de nodemailer con tus credenciales y configuraciones del servidor SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 465,
        secure: true,
        auth: {
            user: 'serviciotecnicoagrofer@gmail.com',
            pass: 'YckQ5Ix8XOyPvSGf',
        },
    });

    // Obtiene el correo electrónico del cuerpo de la solicitud
    const correo = req.body.correo;

    // Envía el correo electrónico
    try {
        const mailOptions = {
            from: 'serviciotecnicoagrofer@gmail.com',
            to: correo,
            subject: 'Restablecimiento de Contraseña',
            text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: https://agrofer.onrender.com/restablecer?token=${resetTokenString}`,

        };
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw error;
    }
};


// Manejar el envío del formulario de restablecimiento de contraseña
const resetPassword = async (req, res) => {
    const { correo, resetToken } = req.params; // Obtener correo y resetToken de los parámetros de la URL
    const { newPassword, confirmPassword } = req.body; // Obtener newPassword y confirmPassword del cuerpo de la solicitud

    try {
        // Verificar si las contraseñas son iguales
        if (newPassword !== confirmPassword) {
            return res.render('restablecer', { message: 'Las contraseñas no coinciden' });
        }

        // Restablecer la contraseña en la base de datos
        await userModel.resetPassword(correo, resetToken, newPassword);
        res.redirect('/login');
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.render('restablecer', { message: 'Error al restablecer la contraseña' });
    }
};



const mostrarUsuarios = async (req, res) => {
    try {
        // Llama al modelo para obtener todos los usuarios registrados
        const usuarios = await userModel.getUsers();

        // Renderiza la vista con los resultados
        console.log(usuarios);
        if (res && res.render) {
            res.render('usuarios', { usuarios, nombreUsuario: req.session.nombreUsuario });
        } else {
            console.error('La variable res no está definida o no tiene la propiedad render');
        }
        return usuarios;
    } catch (error) {
        if (res && res.status) {
            res.status(500).send('Error interno del servidor' + error);
        } else {
            console.error('La variable res no está definida o no tiene la propiedad status');
        }
    }
};

const editarRol = async (req, res) => {
    try {
        const {rol, estado, id } = req.body;
        console.log('Esto es lo que viene del body: ', req.body )

        const edicionExitosa = await userModel.updaterol(rol, estado, id);

        if (edicionExitosa) {
            const usuarios = await userModel.getUsers();
            console.log('Rol asignado correctamente');
            res.render('usuarios', {usuarios, nombreUsuario: req.session.nombreUsuario});
        } else {
          
        }
    } catch (error) {
        console.error('Error al asignar rol:', error);
        res.status(500).send('Error interno del servidor');
    }
};





export { mostrarAnimales, loginUser, mostrarUsuarios, requestPasswordReset, sendPasswordResetEmail, resetPassword, editarRol };
