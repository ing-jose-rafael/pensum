const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio'],
        unique:true,
    },
    estado:{
        type: Boolean,
        default: true,
        required: [true,'El estado es obligatorio'],
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: [true,'El usuario es obligatorio'],
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref:'Categoria',
        required: [true,'La categoria es obligatoria'],
    },
    precio:{
        type: Number,
        default:0,
    },
    descripcion:String,
    disponible:{ type:Boolean, default:true }
}); 

// para no retornar la contraseña
ProductoSchema.methods.toJSON = function(){
    const {estado,__v,_id,...resto} = this.toObject();
    resto.uid = _id;
    return resto;
    
}

module.exports = model('Producto',ProductoSchema);