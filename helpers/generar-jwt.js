const jwt = require('jsonwebtoken');


/**
 * Para llamar esta funcion se requiere como argumento el uid,
 * el identificar unico del usuario, el uid es lo unico que se 
 * va almacenar en el payload del JWT
 */
const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {
        // 
        const payload = { uid };
        // intruccion para firmar un JWT
        // expiresIn tiempo para expirar
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '5h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' );
            } else {
                resolve( token );
            }
        })

    })
}




module.exports = {
    generarJWT
}

