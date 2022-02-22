const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Create a UpTask Account'
    });
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'UpTask Login',
        error
    });
}


exports.crearCuenta = async (req, res) => {

    const { email, password } = req.body

    try {
        await Usuarios.create({
            email,
            password
        })

        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        const usuario = {email};

        await enviarEmail.enviar({
          usuario,
          subject: 'Account Confirmation',
          confirmarUrl,
          archivo: 'account-confirmation'
        });

        req.flash('correcto', 'We sent an email, please confirm your account.');
        res.redirect('/iniciar-sesion');
    } catch (error) { 
        req.flash('error', error.errors.map(error => error.message))      
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Create UpTask Account',
            email
        });
    }
}

exports.formResetPassword = (req, res) => {
    res.render('restablecer', {
        nombrePagina: 'Reset Password'
    })
}

exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo
    }
  });

  if(!usuario){
    req.flash('error', 'Not valid');
    res.redirect('/crear-cuenta');
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash('correcto', 'Account activated successfully');
  res.redirect('/iniciar-sesion');
}