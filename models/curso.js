

const { Schema, model } = require('mongoose');
/**
 * `hTeorica`: lo que dura
 * grupTeoria: lo asigna admiciones 
 * grupTeoriaAsig llevara el registro de grupos asignados
 * grupPracticaAsig llevara el registro de grupos asignados
 */
const CursoSchema = Schema({

  profesor: {
    type: Schema.Types.ObjectId,
    ref: 'UserProf', 
    required: [true, 'El codigo del Profesor es obligatorio'],
  },
  curso: {
    type: Schema.Types.ObjectId,
    ref: 'Materia',
    required: [true, 'El codigo del curso es obligatorio'],
  },

  grupTeoriaAsig: { type: Number, default: 0 },
  grupPracticaAsig: { type: Number, default: 0 },
  estado: { type: Boolean, default: true },
});

// para no retornar la contraseña
CursoSchema.methods.toJSON = function () {
  const { estado, __v, _id, ...resto } = this.toObject();
  resto.uid = _id;
  return resto;
}

module.exports = model('Curso', CursoSchema);