// userController.js
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
            text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://agrofer.onrender.com/restablecer, copie y pegue este token unico y con limite de tiempo token= ${resetTokenString}`,
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
    const { resetToken, newPassword } = req.body;
    const correo = req.body.correo;

    try {
        // Verificar si el token es válido y obtener el usuario asociado desde la base de datos
        const user = await userModel.getUserByResetToken(correo, resetToken);
        
        if (!user) {
            console.error('Token inválido o expirado - Usuario no encontrado');
            return res.render('restablecer', { resetToken, message: 'Token inválido o expirado' });
        }

        // Restablecer la contraseña en la base de datos
        await userModel.resetPassword(resetToken, newPassword);
        res.redirect('/login');
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.render('restablecer', { resetToken, message: 'Error al restablecer la contraseña' });
    }
};



export { mostrarAnimales, loginUser, requestPasswordReset, sendPasswordResetEmail, resetPassword };
