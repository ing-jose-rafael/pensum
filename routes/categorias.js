const { Router } = require('express'); // para poder crear la constante router
const { check } = require('express-validator');
const { obtenerCategoria, obtenerCategoriaById, crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeIdCategoria } = require('../helpers/db-validators');
// const { login, googleSignIn } = require('../controllers/auth');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');

const router = Router();

/**
 * Ruta para obtener las categorias - publico
 */
router.get('/',[
    check('limited', 'El limite debe de ser un valor numérico').if(check('limited').exists()).isNumeric(),
    check('desde', 'Desde debe de ser un valor numérico').if(check('desde').exists()).isNumeric(),
],obtenerCategoria);
/**
 * Ruta para obtener una categorias por Id - publico
 */
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeIdCategoria),
    validarCampos
],obtenerCategoriaById);
/**
 * Ruta crear categoria - 
 * privado: personas con token válido
 */
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').notEmpty(),
    validarCampos
],crearCategoria);
/**
 * Ruta actualizar categoria - 
 * privado: personas con token válido
 */
router.put('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeIdCategoria),
    check('nombre','El nombre es obligatorio').notEmpty(),
    validarCampos
],actualizarCategoria);
/**
 * Ruta eleiminat categoria - 
 * privado: solo ADMIN_ROLE 
 */
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeIdCategoria),
    validarCampos,
],eliminarCategoria);

module.exports = router;