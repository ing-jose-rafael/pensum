const {Router} = require('express');
const { check } = require('express-validator');
const { obtenerProdutos, crearProduto, obtenerProdutosPorId, eliminarProduto, editarProduto } = require('../controllers/productos');
const { existeIdCategoria, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');

const router = Router();
/**
 * Ruta para obtener todos los productos - publico
 */
router.get('/',[
    check('limited', 'El limite debe de ser un valor numérico').if(check('limited').exists()).isNumeric(),
    check('desde', 'Desde debe de ser un valor numérico').if(check('desde').exists()).isNumeric(),
],obtenerProdutos);
/**
 * Ruta para obtener un producto por Id - publico
 */
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProdutosPorId);
/**
 * Ruta para crear un producto - publico
 */
router.post('/',[
    validarJWT,
    check('nombre','El nombre es requerido').notEmpty(),
    check('categoria','No es un ID de Mongo').isMongoId(),
    validarCampos,
    check('categoria').custom(existeIdCategoria),
    validarCampos
],crearProduto);
/**
 * Ruta actualizar producto - 
 * privado: personas con token válido
 */
router.put('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
    validarCampos
],editarProduto);
/**
 * Ruta eliminar producto - 
 * privado: solo ADMIN_ROLE 
 */
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId),
    validarCampos,
],eliminarProduto);



module.exports = router;