const { Router } = require('express');
const { check } = require('express-validator');
const { asignar, editarAsignacion, eliminarAsignacion } = require('../controllers/asinar');
const { existeProfesorPorId, existeAsignaturaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middleware');


const router = Router();

router.post('/',[
    check('idProfe','No es un ID de profesor válido').isMongoId(),
    check('idCurso','No es un ID de curso válido').isMongoId(),
    validarCampos,
    check('idProfe').custom(existeProfesorPorId),
    check('idCurso').custom(existeAsignaturaPorId),
    validarCampos,
],asignar);

router.put('/:idP/:idC',[
    check('idP','No es un ID de profesor válido').isMongoId(),
    check('idC','No es un ID de curso válido').isMongoId(),
    validarCampos,
    check('idP').custom(existeProfesorPorId),
    check('idC').custom(existeAsignaturaPorId),
    validarCampos,
],editarAsignacion);

router.delete('/:idP/:idC',[
    check('idP','No es un ID de profesor válido').isMongoId(),
    check('idC','No es un ID de curso válido').isMongoId(),
    validarCampos,
    check('idP').custom(existeProfesorPorId),
    check('idC').custom(existeAsignaturaPorId),
    validarCampos,
],eliminarAsignacion);

module.exports = router;