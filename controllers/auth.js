const { response } = require('express');
const bcryptjs = require('bcryptjs');

const { Usuario } = require('../models');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req,res=response) => {
    const {  correo, password } = req.body;
    // console.log(correo);
    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo}).exec();
        if (!usuario) {
            // no existe el usuario en la BD
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - correo'
            });    
        }
        // Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - estado: false'
            }); 
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password ); // true o false
        if (!validPassword) {
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - Password'
            }); 
        }
        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}
const googleSignIn = async (req, res=response)=>{
    const { id_token } = req.body;
    try {
        const { nombre,correo,img } = await googleVerify(id_token)
        // es let por que se va a modificar
        let usuario = await Usuario.findOne({correo});
        // si el usuario no existe lo creo
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password:':p',
                img,
                google:true,
            }
            usuario = new Usuario(data);
            await usuario.save(); // guardando el usuario en la BD
        }
        // si el usuario se encuentra bloqueado en mi BD
        if (!usuario.estado) {
            res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });
        }
        // si paso todas las válidaciones generamos el JWT
        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok:false,
            msg:'El token no se pudo verificar'
        });
    }
}

const validarTokenUsuario = async (req, res = response ) => {

    // Generar el JWT
    const token = await generarJWT( req.usuario._id );
    
    res.json({
        usuario: req.usuario,
        token: token,
    })

}

module.exports = { login,googleSignIn,validarTokenUsuario }