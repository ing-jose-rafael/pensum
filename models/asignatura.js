

const {Schema,model} = require('mongoose');
/**
 * `hTeorica`: lo que dura
 * grupTeoria: lo asigna admiciones 
 * grupTeoriaAsig llevara el registro de grupos asignados
 * grupPracticaAsig llevara el registro de grupos asignados
 */
const AsignaturaSchema = Schema({
    codigo:{type:String,required:[true,'El codigo es obligatorio'],unique: true},
    nombre:{type:String,required:[true,'El nombre es obligatorio'],unique: true},
    hTeorica:{type:Number,required:[true,'las horas teorica es obligatoria']},
    hPractica:{type:Number,},
    grupTeoria:{type:Number},
    grupPractica:{type:Number},
    profesores:{type:Array,default:[],},
    grupTeoriaAsig:{type:Number,default:0},
    grupPracticaAsig:{type:Number,default:0},
    estado:{type:Boolean,default:true},
});

// para no retornar la contraseña
AsignaturaSchema.methods.toJSON = function(){
    const {estado,__v,_id,...resto} = this.toObject();
    resto.uid = _id;
    return resto;
}

module.exports = model('Asignatura',AsignaturaSchema);