
import express from 'express'
import * as userController from './controlador/userController.js'
import  * as animalController from './controlador/animalController.js'
import * as vacasController from './controlador/vacasController.js'
import bodyParser from 'body-parser'
import { eliminarAnimal } from './controlador/animalController.js'
import { eliminarVaca } from './controlador/vacasController.js'
import session from 'express-session'
import {  getVacasByUserId } from './modelo/vacasModel.js'
import { getSalidassByUserId } from './modelo/salidasModel.js'
import { getCebaByUserId } from './modelo/cebaModel.js'
import * as salidasController from './controlador/salidasController.js'
import { getAnimalesByUserId } from './modelo/userModel.js'
import * as cebaController from './controlador/cebaController.js'
import * as compraController from './controlador/compraController.js'
import { getCompraByUserId } from './modelo/compraModel.js'
import * as salidas_vacasController from './controlador/salidas_vacasController.js'
import { getSalidasVacasByUserId } from './modelo/salidas_vacasModel.js'
import { getSalidasComprasByUserId } from './modelo/compraModel.js'
import { PORT } from './src/config.js'
import * as authController from './controlador/authController.js'


// index.js u otro archivo principal
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 15; // Ajusta el número según tus necesidades



const router = express.Router();
const app = express();
app.use(session({
    secret: 'miapp',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, }
}));

app.use(express.static('./css'));

// ... (otras configuraciones y middleware)
app.set('views', './vistas')
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./vistas'))
app.use(express.static('./src'))
//app.use(express.static('./css'))
app.use('/auth', router);

app.get('/', function(req, res){
    /*res.send('Aplicacion iniciada')*/
    
    res.render('primerapag')
})

app.get('/login', function(req, res){
    res.render('login')
})

app.get('/registrarse', (req, res) => {
    // Lógica para renderizar la página de registro
    res.render('registrarse');
});

// Define tus rutas aquí
// Define isAuthenticated como un middleware
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        // Si el usuario está autenticado, permite el acceso a la siguiente ruta
        return next();
    } else {
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión u otra página
        res.redirect('/'); // Puedes redirigir a la página de inicio de sesión o a otra página
    }
};

// Implementa isAuthenticated en tus rutas que requieran autenticación
app.get('/paginaprincipal', isAuthenticated, (req, res) => {
    const maxAge = req.session.cookie.maxAge;
    console.log('Tiempo de vida de la sesión en milisegundos:', maxAge);
    const nombreUsuario = req.session.nom_usuario

    res.render('paginaprincipal', { nombreUsuario: nombreUsuario });
});


app.get('/animales', isAuthenticated, async (req, res) => {
    const nombreUsuario = req.session.nom_usuario;
    try {
        const userId = req.session.userId;
        const animales = await getAnimalesByUserId(userId); // Aquí usamos la función directamente
        res.render('animales', { nombreUsuario: nombreUsuario, animales: animales });
    } catch (error) {
        console.error('Error al obtener animales:', error);
        res.status(500).send('Error interno del servidor');
    }
});






// Ruta para cerrar sesión
app.get('/logout', isAuthenticated,  (req, res) => {
    // Destruye la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            // Redirige al inicio u a otra página después de cerrar sesión
            res.redirect('/login');
            console.log('Sesión cerrada correctamente');
        }
    });
});

  // Ruta para agregar un animal asociado al usuario
app.get('/agregaranimal', isAuthenticated, async (req, res) => {
    const nombreUsuario = req.session.nom_usuario;
    try {
        const userId = req.session.userId;
        const vacas = await getVacasByUserId(userId); // Aquí usamos la función directamente
        res.render('agregaranimal', { vacas, nombreUsuario: nombreUsuario });
    } catch (error) {
        console.error('Error al obtener vacas:', error);
        res.status(500).send('Error interno del servidor');
    }
});


app.get('/agregarvacas', isAuthenticated, (req, res) => {
    const nombreUsuario = req.session.nom_usuario
    res.render('agregarvacas', { nombreUsuario: nombreUsuario });
});
  
app.get('/vacas', isAuthenticated, async (req, res) => {
    const nombreUsuario = req.session.nom_usuario;
    try {
        const userId = req.session.userId;
        const vacas = await getVacasByUserId(userId); // Aquí usamos la función directamente
        res.render('vacas', { nombreUsuario: nombreUsuario, vacas: vacas });
    } catch (error) {
        console.error('Error al obtener vacas:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/salidas', isAuthenticated, async (req, res) => {
    const nombreUsuario = req.session.nom_usuario;
    try {
        const userId = req.session.userId;
        const salidas = await getSalidassByUserId(userId); // Aquí usamos la función directamente
        res.render('salidas', { nombreUsuario: nombreUsuario, salidas: salidas });
    } catch (error) {
        console.error('Error al obtener salidas:', error);
        res.status(500).send('Error interno del servidor');
    }
})

app.get('/agregarsalida', isAuthenticated, async (req, res) => {
    const nombreUsuario = req.session.nom_usuario;
    try {
        const userId = req.session.userId;
        const salidas = await getAnimalesByUserId(userId);
        res.render('agregarsalida', { nombreUsuario: nombreUsuario, salidas: salidas});
    }catch (error) { 
        console.error('error al agregar salida:', error );
    }
});

//app.get('/agregarterneroseva', isAuthenticated, async (req, res) => {
  //  const nombreUsuario = req.session.nom_usuario;
    //try {
      //  const userId = req.session.userId;
        //const vacas = await getVacasByUserId(userId);
        //const salidas = await getAnimalesByUserId(userId);
        //res.render('agregarterneroseva', { nombreUsuario: nombreUsuario, salidas: salidas, vacas: vacas});
    //}catch (error) { 
      //  console.error('error al agregar salida:', error );
    //}
//});


app.get('/terneros-ceba', isAuthenticated, async (req, res) => {
    const nombreUsuario = req.session.nom_usuario;
    try {
        const userId = req.session.userId;
        const cebas = await getCebaByUserId(userId); // Aquí usamos la función directamente
        res.render('terneros-ceba', { nombreUsuario: nombreUsuario, cebas: cebas });
    } catch (error) {
        console.error('Error al obtener salidas:', error);
        res.status(500).send('Error interno del servidor');
    }
   
});

app.get('/terneroscompra', isAuthenticated, async (req, res) => {
    const nombreUsuario = req.session.nom_usuario;
    try {
        const userId = req.session.userId;
        const compras = await getCompraByUserId(userId); // Aquí usamos la función directamente
        res.render('terneroscompra', { nombreUsuario: nombreUsuario, compras: compras });
    } catch (error) {
        console.error('Error al obtener animales:', error);
        res.status(500).send('Error interno del servidor');
    }
});
app.get('/agregarternerocompra', isAuthenticated , (req, res) => {
    const nombreUsuario = req.session.nom_usuario
    res.render('agregarternerocompra', { nombreUsuario: nombreUsuario });
});

app.get('/salidas_vacas', isAuthenticated, async (req, res) => {
    const nombreUsuario = req.session.nom_usuario;
    try {
        const userId = req.session.userId;
        const salidas_vacas = await getSalidasVacasByUserId(userId); // Aquí usamos la función directamente
        res.render('salidas_vacas', { nombreUsuario: nombreUsuario, salidas_vacas: salidas_vacas });
    } catch (error) {
        console.error('Error al obtener salidas:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/salidas_compras', isAuthenticated, async (req, res) => {
    const nombreUsuario = req.session.nom_usuario;
    try {
        const userId = req.session.userId;
        const salidas_compras = await getSalidasComprasByUserId(userId); // Aquí usamos la función directamente
        res.render('salidas_compras', { nombreUsuario: nombreUsuario, salidas_compras: salidas_compras });
    } catch (error) {
        console.error('Error al obtener salidas:', error);
        res.status(500).send('Error interno del servidor');
    }
});



app.get('/contrasena', (req, res) => { 
    res.render('contrasena');
});

app.get('/solicitud', (req, res) => {
    res.render('solicitud');
});

app.get('/restablecer', (req, res) => {
    res.render('restablecer');
});



app.post('/editarcompra', isAuthenticated, compraController.editarCompra, (req, res) => {
    res.redirect('terneroscompra')
});
app.post('/editaranimal', isAuthenticated, animalController.editarAnimal, (req, res) => {
    res.redirect('animales')
});


app.post('/editarvaca', isAuthenticated, vacasController.editarVaca, (req, res) => {
    res.redirect('vacas')
});


app.post('/eliminarcompra', isAuthenticated, compraController.insertarSalida_Compra, (req, res) => {
    res.redirect('compras')
});

app.post('/agregarternerocompra', isAuthenticated, compraController.insertarCompra, (req, res) => {

    res.redirect('/terneroscompra')
});



app.post('/agregarsalida',  isAuthenticated, salidasController.insertarSalida, (req, res) => {
    res.redirect('/salidas');
});

app.post('/eliminarvaca',isAuthenticated, salidas_vacasController.insertarSalida_vaca, (req, res) => {
    res.redirect('/vacas');
})

app.post('/eliminar',isAuthenticated,  eliminarAnimal, (req, res) =>{

    res.redirect('/animales');
});

// Ruta para manejar la solicitud de agregar vaca desde el formulario
app.post('/agregarvaca',isAuthenticated, vacasController.agregarVaca, (req, res) =>{
    res.redirect('/vacas');
} );

app.post('/create-user', userController.createUser);
app.post('/login', userController.loginUser);
app.post('/agregaranimal', isAuthenticated, animalController.insertarAnimal, (req, res) => {
    // Después de insertar el animal, redirige a la vista "agregaranimal" o realiza alguna otra acción
    res.redirect('/animales');
});

app.post('/agregarterneroseva', isAuthenticated, cebaController.insertarCeba, (req, res) => {
    res.redirect('/terneros-ceba');
});

app.post('/solicitud', userController.requestPasswordReset)

app.post('/resetPassword', userController.resetPassword)

// ... (más configuraciones y middleware)

app.listen(PORT, function() {
    console.log('Aplicacion iniciada en el puerto', PORT);
});

export default  router;