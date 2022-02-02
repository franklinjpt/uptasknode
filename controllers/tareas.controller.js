const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});

    //leer valor del input
    const {tarea} = req.body;

    //estado = 0 incompleto y ID de proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    //insertar en la base de datos
    const result = await Tareas.create({tarea, estado, proyectoId});

    if(!result){
        return next();
   };

   //redireccionar
   res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstado = async (req, res, next) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({where: {id}});

    let estado = true;
    if(tarea.estado){
        estado = false;
    }
    tarea.estado = estado;

    const result = await tarea.save();

    if(!result) return next();

    res.send('Updated');
}

exports.eliminarTarea = async (req, res, next) =>{
    const { id } = req.params;

    const result = await Tareas.destroy({where: {id}});

    if(!result) return next();

    res.send('Task deleted correctly');
}