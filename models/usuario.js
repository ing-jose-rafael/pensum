/**
 * como va lucir el usuario en la DB
 */
/**
 *  {
 *      nombre: 'Nombre usuario',
 *      correo: 'usuario@correo.com',
 *      password: 'contraseña',
 *      img: 'imagen/usaurio',
 *      rol: '12768279320', 
 *      estado: true o false, 
 *      google: true o false, // si lo creamos con google sind 
 *  }
 * ******************************************************************************
 * `UsuarioSchema` contenie el esquema de los usuario donde 
 ** `nombre` será string y obligatorio
 ** `correo` será string, obligatorio y unico
 ** `password` será string y obligatorio
 ** `img` será string
 ** `rol` será enum solo tentrá dos valores, obligatorio
 ** `estado` será boleano, por default `true` cuando se crea el usuario
 ** `google` será boleano, por default `false` si el usuario es creado por google 
 */
const { Schema, model } = require('mongoose');
const UsuarioSchema = Schema({
    nombre:{
        type: String,
        required:[true,'El nombre es obligatorio'],
    },
    correo:{
        type: String,
        required:[true,'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required:[true,'la contraseña es obligatoria'],
    },
    img: String,
    rol:{
        type: String,
        required:true,
        default:'USER_ROLE',
        enum: ['ADMIN_ROLE','USER_ROLE','VENTAS_ROLE'],
    },
    estado:{
        type: Boolean,
        default: true,
    },
    google:{
        type: Boolean,
        default: false,
    },
});


// para no retornar la contraseña
UsuarioSchema.methods.toJSON = function(){
    const {password,__v,_id,...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
    
}

// exportando 
module.exports = model('Usuario', UsuarioSchema);