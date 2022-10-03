const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


exports.proyectosHome = async (req, res) =>{

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
};


exports.formularioProyecto = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};


exports.nuevoProyecto = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    //Envia a la consola lo que el usuario escriba 
    //console.log(req.body); CARPETA 14 CURSO

    //validar el input
    const { nombre } = req.body;

    let errores = [];
    if (!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }
    //si hay errores
    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else{
        //Insertar BD
        //No hay error
        //const url =  slug(nombre).toLowerCase();
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
            /* .then(() => console.log('Insertado correctamente'))
            .catch(error => console.log(error)); */
    }
};

exports.proyectoUrl = async (req, res, next) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
   
    const proyectoPromise =  Proyectos.findOne({
        where:{
            url:req.params.url,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas el proyecto actual
    const tareas = await Tareas.findAll({
        where:{
            proyectoId: proyecto.id
        }
    });

    if(!proyecto) return next();
    
    // render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas        
    });
};

exports.formularioEditar = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise =  Proyectos.findAll({where: {usuarioId}});
   
    const proyectoPromise =  Proyectos.findOne({
        where:{
            id:req.params.id,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
    
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });
};

exports.actualizarProyecto = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    //Envia a la consola lo que el usuario escriba 
    //console.log(req.body); CARPETA 13 CURSO

    //validar el input
    const { nombre } = req.body;

    let errores = [];
    if (!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }
    //si hay errores
    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else{
        //Insertar BD
        //No hay error
        //const url =  slug(nombre).toLowerCase();
        await Proyectos.update(
            {nombre: nombre },
             {where: {id: req.params.id}}
             );
        res.redirect('/');
            /* .then(() => console.log('Insertado correctamente'))
            .catch(error => console.log(error)); */
    }
};

exports.eliminarProyecto = async (req, res, next) =>{
    //req, query o params
   const {urlProyecto} = req.query;

   const resultado =  await Proyectos.destroy({where: {url: urlProyecto}});

    if (!resultado) {
        return next();
    }
   res.status(200).send('Proyecto Eliminado Correctamente');
};