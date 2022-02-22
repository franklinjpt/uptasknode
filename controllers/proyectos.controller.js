const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.render('index', {
        nombrePagina: 'Projects',
        proyectos
    });
}

exports.formProyecto = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.render('nuevoProyecto', {
        nombrePagina: 'New project',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
    const {nombre} = req.body;

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    let errores = [];

    if(!nombre) errores.push({'texto': 'Add a project name'})

    if(errores.length>0){
        res.render('nuevoProyecto', {
            nombrePagina: 'New project',
            errores,
            proyectos
        })
    } else {
        //Inserta a la base de datos
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
    }
}

exports.proyectoByUrl = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    const tareas = await Tareas.findAll({
        where: {proyectoId: proyecto.id},
        // include: [
        //     {model: Proyectos}
        // ]
    })

    if(!proyecto) return next();

    res.render('tareas',{
        nombrePagina: 'Project tasks',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto',{
        nombrePagina: 'Edit Project',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {
    const {nombre} = req.body;

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    let errores = [];

    if(!nombre) errores.push({'texto': 'Add a project name'})

    if(errores.length>0){
        res.render('nuevoProyecto', {
            nombrePagina: 'New project',
            errores,
            proyectos
        })
    } else {
        //Inserta a la base de datos
        try {
            await Proyectos.update(
                {nombre: nombre},
                {where: {id: req.params.id}, individualHooks: true}                             
                );
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
        
    }
}

exports.eliminarProyecto = async (req, res, next) =>{

    const {urlProyecto} = req.query;

    const result = await Proyectos.destroy({where: {url: urlProyecto}})

    if(!result){
        return next()
    }

    res.send('Project successfully deleted')
}