const { Router } = require('express');
const { check } = require('express-validator');
const { asignar, editarAsignacion, eliminarAsignacion, asinaciones, eliAsignacion, editAsignacion } = require('../controllers/asinar');
const { existeProfesorPorId, existeAsignaturaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middleware');


const router = Router();

router.post('/seed',asinaciones);

router.post('/',[
    check('idProfe','No es un ID de profesor válido').isMongoId(),
    check('idCurso','No es un ID de curso válido').isMongoId(),
    validarCampos,
    check('idProfe').custom(existeProfesorPorId),
    check('idCurso').custom(existeAsignaturaPorId),
    validarCampos,
],asignar);

router.put('/seed/:id',[
    check('id','No es un ID de profesor válido').isMongoId(),
    validarCampos
],editAsignacion);

router.put('/:idP/:idC',[
    check('idP','No es un ID de profesor válido').isMongoId(),
    check('idC','No es un ID de curso válido').isMongoId(),
    validarCampos,
    check('idP').custom(existeProfesorPorId),
    check('idC').custom(existeAsignaturaPorId),
    validarCampos,
],editarAsignacion);

// router.delete('/:id',[
//     check('id','No es un ID válido').isMongoId(),
//     validarCampos
// ],eliAsignacion);

router.delete('/:idP/:idC',[
    check('idP','No es un ID de profesor válido').isMongoId(),
    check('idC','No es un ID de curso válido').isMongoId(),
    validarCampos,
    check('idP').custom(existeProfesorPorId),
    check('idC').custom(existeAsignaturaPorId),
    validarCampos,
],eliminarAsignacion);

module.exports = router;