const express = require("express");
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const  flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//IMPORTAR LAS VARIABLES
require('dotenv').config({ path: 'variables.env'});


// helpers con algunas funciones 
const helpers = require('./helpers');

// Crear la conexión db
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

//crear una aplicación con express
const app = express();

// Habilitar pug
app.set('view engine', 'pug');

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar bodyParser para leer datos de formulario
app.use(bodyParser.urlencoded({extended:true}));


// Añadir la carpeta d las vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

// sesiones nos permite navegar entre distintas paginas sin volver a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar var dump a la aplicación
app.use((req, res, next) =>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});


app.use('/', routes());

//app.listen(5000);

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

app.listen(port, host, () => {
    console.log('El Servidor esta funcionando');
})


//require('./handlers/email');