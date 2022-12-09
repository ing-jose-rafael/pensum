const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

/**
 * Middleware para validar que en la peticion contenga el JWT
 * @param {*} req request
 * @param {*} res response
 * @param {*} next continua si todo sale bien
 * @returns si todo sale bien agrega el usuario a la request
 */
const validarJWT = async( req = request, res = response, next ) => {
    // obteniendo el JWT desde los header
    const token = req.header('x-token');
    // si en la peticion no viene el JWT lo sacamos
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        // verifia y extrae el uid si el token es válido
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );
        // pueda que no exista el usuario 
        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el usuario tiene estado true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }
        
        // adjunta el usuario a la req, creando una propiedad nueva
        req.usuario = usuario;
        next();

    } catch (error) {

        // console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}




module.exports = {
    validarJWT
}