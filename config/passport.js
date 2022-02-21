const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia la modelo de autenticación
const Usuarios = require('../models/Usuarios');

//local strategy - Login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y passwod   
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                      email,
                      activo: 1
                    }
                })

                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
                }

                return done(null, usuario);
            } catch (error) {
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;