const {Router} = require('express');
const { check } = require('express-validator');
const { obtenerProfesor, obtenerProfesorPorID, crearProfesor, actualizarProfesor, eliminarProfesor } = require('../controllers/profesores');
const { existeProfesorPorId, existeProfesorPorCedula } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middleware');

const router = Router();

router.get('/',obtenerProfesor);
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProfesorPorId),
    validarCampos
],obtenerProfesorPorID);
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('cedula','La cedula es obligatorio').notEmpty(),
    check('contratacion','El tipo de contratacion es obligatorio').notEmpty(),
    check('cedula').custom(existeProfesorPorCedula),
    
    validarCampos,
],crearProfesor);
router.put('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProfesorPorId),
    validarCampos
],actualizarProfesor);
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProfesorPorId),
    validarCampos
],eliminarProfesor);

module.exports = router;