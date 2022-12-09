const { response } = require('express')

/**
 * Middleware para validar que el rol sea ADMIN_ROLE, se tiene que llamar despues de pasar el middleware validarJWT
 * @param {*} req request
 * @param {*} res response
 * @param {*} next continua si todo sale bien
 * @returns puede avanzar si el rol es de tipo ADMIN_ROLE
 */
const esAdminRole = ( req, res = response, next ) => {
    // si en la request no esta el usuario, no validamos el middleware del token antes
    if ( !req.usuario ) {
        // el error seria mio status(500)
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }
    // desetructurando el rol y nombre dek objeto usuario que esta en la request
    const { rol, nombre } = req.usuario;
    // compara que el rol sea de un tipo en especial
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }
    // en este punto válido que el rol sea del tipo ADMIN_ROLE lo dejamos continuar
    next();
}

/**
 * Funsion para proteger las rutas con los roles que reciba de parametros
 * @param  {...any} roles todo lo que se envie lo transforma en un arreglo
 * @returns 
 */
const tieneRole = ( ...roles  ) => {
    // retornando una funcion 
    return (req, res = response, next) => {
         // si en la request no esta el usuario, no validamos el middleware del token antes
        if ( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }
        // compara que el rol del usuarion que esta autenticado sea de un tipo en especial, como el del arreglo de los parametros
        if ( !roles.includes( req.usuario.rol ) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }


        next();
    }
}



module.exports = {
    esAdminRole,
    tieneRole
}