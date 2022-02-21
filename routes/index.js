const { Router } = require("express");
const proyectosCtrl = require("../controllers/proyectos.controller");
const tareasCtrl = require("../controllers/tareas.controller");
const usuariosCtrl = require("../controllers/usuarios.controller");
const authCtrl = require("../controllers/auth.controller");
//importando express validator
const { body } = require("express-validator");

const router = Router();

module.exports = function () {

    router.get('/',
        authCtrl.usuarioAutenticado,
        proyectosCtrl.proyectosHome
    );

    router.get('/nuevo-proyecto',
        authCtrl.usuarioAutenticado,
        proyectosCtrl.formProyecto
    );

    router.post('/nuevo-proyecto',
        authCtrl.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosCtrl.nuevoProyecto
    );

    router.get('/proyectos/:url',
        authCtrl.usuarioAutenticado,    
        proyectosCtrl.proyectoByUrl
    );

    router.get('/proyectos/editar/:id',
        authCtrl.usuarioAutenticado,
        proyectosCtrl.formularioEditar
    );

    router.post('/nuevo-proyecto/:id',
        authCtrl.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosCtrl.actualizarProyecto
    );

    router.delete('/proyectos/:url',
        authCtrl.usuarioAutenticado,
        proyectosCtrl.eliminarProyecto
    );

    //Tareas
    router.post('/proyectos/:url',
        authCtrl.usuarioAutenticado,
        tareasCtrl.agregarTarea
    );

    router.patch('/tareas/:id',
        authCtrl.usuarioAutenticado, 
        tareasCtrl.cambiarEstado
    );

    router.delete('/tareas/:id',
        authCtrl.usuarioAutenticado,
        tareasCtrl.eliminarTarea
    );

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosCtrl.formCrearCuenta);
    router.post('/crear-cuenta', usuariosCtrl.crearCuenta);
    router.get('/confirmar/:correo', usuariosCtrl.confirmarCuenta);

    //Iniciar sesion
    router.get('/iniciar-sesion', usuariosCtrl.formIniciarSesion);
    router.post('/iniciar-sesion', authCtrl.autenticarUsuario);
    
    router.get('/cerrar-sesion', authCtrl.cerrarSesion);

    //Autenticación
    router.get('/restablecer', usuariosCtrl.formResetPassword);
    router.post('/restablecer', authCtrl.enviarToken);
    router.get('/restablecer/:token', authCtrl.validarToken);
    router.post('/restablecer/:token', authCtrl.actualizarPassword);

    return router;
}