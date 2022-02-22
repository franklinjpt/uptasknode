const express = require('express')
const routes = require('./routes');
const path = require('path');
const db = require('./config/db');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config();

require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log("db is connected"))
    .catch(error => console.error(error))

const app = express();

//Cargar archivos estaticos
app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//bodyparser
app.use(express.urlencoded({extended: false}));

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

// session nos permite navegar entre distintas paginas sin volvenor a autenticar
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//Pasar var_dump
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next()
});

app.use('/', routes() );

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => console.log(`Example app listening on port ${port}`))