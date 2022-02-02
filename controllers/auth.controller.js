const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const crypto = require("crypto");
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true
});

exports.usuarioAutenticado = (req, res, next) => {

    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/iniciar-sesion');
};

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

exports.enviarToken = async (req, res) => {
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: {email}});

    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000

    await usuario.save();

    const resetUrl = `http//${req.headers.host}/restablecer/${usuario.token}`;

    console.log(resetUrl);
}

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token
    }
  });

  if(!usuario){
    req.flash('error', 'No Válido');
    res.redirect('/restablecer');
  }

  res.render('resetPassword', {
    nombrePagina: 'Restablecer Contraseña'
  })
}

exports.actualizarPassword = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte] : Date.now()
      }
    }
  })

  if(!usuario){
    req.flash('error', 'No válido');
    res.redirect('/restablecer');
  }

  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  await usuario.save();

  req.flash('correcto', 'Tu password se ha modificado correctamente');
  res.redirect('/iniciar-sesion');
}