const { Schema, model } = require('mongoose');
/**
 * `dedicacion` tipo de contratacion 
 * [tope]: las horas que deberia tener asignadas
 * `cargo`: asignacion administrativa
 * `horas`: numero de horas asignadas
 * `cursos` Array de los curos, `asignatura`: id de la asignatura, grupoTeoria ó grupoPractica: grupos asignados al profesor
 * horaTeoria o horaPractica: este valor viene del curso
 * ** 
 */
const UserProfeSchema = Schema({
    nombre:{ type:String, required:[true,'El nombre es obligatorio']},
    cedula:{
        type:String,
        required:[true,'La cedula es obligatoria'],
        unique:true,
    },
    contratacion:{
        type:String,
        required:[true,'El tipo de contrato es obligatorio']
    },
    cargo:String,
    tope:{ type:Number,default:0 },
    horasAsi:{ type:Number,default:0 },
    observaciones:{type:String,default:''},
    estado:{ type:Boolean,default:true}
    
});

// para no retornar la contraseña
UserProfeSchema.methods.toJSON = function(){
    const {estado,__v,_id,...resto} = this.toObject();
    resto.uid = _id;
    return resto;
}

module.exports = model('UserProf',UserProfeSchema);