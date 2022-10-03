const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

// Función  para revisar si el  usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {

    //si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    //sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
};

// Función para cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
};

exports.enviarToken = async (req, res) =>{
    //verificar si el usuario existe
    const usuario = await Usuarios.findOne({where: { email: req.body.email }});

    // si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe el usuario');
        res.render('reestablecer', {
            nombrePagina: 'Reestablecer tu Contraseña',
            mensajes:req.flash()
        })
    };

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    
    // guardar en la base de datos
    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //console.log(resetUrl);
    //Enviar el Correo con el Token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    //terminar
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion'); 
};

exports.validarToken = async (req, res) =>{
    //res.JSON(req.params.token)
    const usuario = await Usuarios.findOne({where: { token: req.params.token}});

    if(!usuario){
        req.flash('error', 'No Válidao');
        res.redirect('/reestablecer');
    }

    //Formulario generar password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

exports.actualizarPassword = async (req, res) => {
    //verifica el usuario
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: { [ Op.gte]: Date.now()}
        }
    });

    // verifica si el usuario existe
    if(!usuario){
        req.flash('error', 'No Válidao');
        res.redirect('/reestablecer');  
    }

    // hashear password usuario
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}