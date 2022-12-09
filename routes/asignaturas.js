const {Router} = require('express');
const { check } = require('express-validator');
const { obtenerAsignatura, obtenerAsignaturaID, crearAsignatura, actualizarAsignatura, eliminarAsignatura } = require('../controllers/asignaturas');
const {  existeAsignaturaPorId, existeAsignaturaPorCodigo, existeAsignaturaPorNombre } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middleware');

const router = Router();

router.get('/',obtenerAsignatura);
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeAsignaturaPorId),
    validarCampos
],obtenerAsignaturaID);
router.post('/',[
    validarJWT,
    check('codigo','El codigo es obligatorio').notEmpty(),
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('hTeorica','horas teorica son obligatorio').notEmpty(),
    check('codigo').custom(existeAsignaturaPorCodigo),
    validarCampos,
    check('nombre').custom(existeAsignaturaPorNombre),
    validarCampos
],crearAsignatura);
router.put('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeAsignaturaPorId),
    validarCampos
    
],actualizarAsignatura);
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeAsignaturaPorId),
    validarCampos
],eliminarAsignatura);

module.exports = router