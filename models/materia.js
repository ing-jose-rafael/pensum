

const {Schema,model} = require('mongoose');
/**
 * `hTeorica`: lo que dura
 * grupTeoria: lo asigna admiciones 
 * grupTeoriaAsig llevara el registro de grupos asignados
 * grupPracticaAsig llevara el registro de grupos asignados
 */
const MateriaSchema = Schema({
    codigo:{type:String,required:[true,'El codigo es obligatorio'],unique: true},
    nombre:{type:String,required:[true,'El nombre es obligatorio'],unique: true},
    hTeorica:{type:Number,required:[true,'las horas teorica es obligatoria']},
    hPractica:{type:Number,},
    grupTeoria:{type:Number},
    grupPractica:{type:Number},
    estado:{type:Boolean,default:true},
});

// para no retornar la contraseña
MateriaSchema.methods.toJSON = function(){
    const {estado,__v,_id,...resto} = this.toObject();
    resto.uid = _id;
    return resto;
}

module.exports = model('Materia',MateriaSchema);