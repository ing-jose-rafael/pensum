const { Router } = require('express'); // para poder crear la constante router
const { check } = require('express-validator');

const { usuarioGet, usuarioPut,usuarioDelete, usuarioPost} = require('../controllers/usuarios');
const {emailExiste, esRolValido,existeId} = require('../helpers/db-validators');

const { validarCampos,validarJWT, esAdminRole, tieneRole } = require('../middleware');

const router = Router();

router.get('/',[
    check('limited', 'El limite debe de ser un valor numérico').if(check('limited').exists()).isNumeric(),
    check('desde', 'Desde debe de ser un valor numérico').if(check('desde').exists()).isNumeric(),
    validarCampos
],usuarioGet); // mandando la referencia  de la funsion
/** Rutas para crear Usuarios */
router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('correo','Correo no válido').isEmail(),
    check('correo').custom(emailExiste),
    check('password','El password debe ser más de 5 letras').isLength({min:5}).not().isEmpty(),
    check('rol').custom(esRolValido), 
    
    validarCampos
],usuarioPost);
/**
 * para actualizar se ouede quitar la validacion del rol
 * */
router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
    check('id').custom(existeId),
    check('rol').custom(esRolValido),
    check('rol').custom(esRolValido), 

    validarCampos
],usuarioPut);
/** Ruta para eliminar usuario */
router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ROLE','VENTA_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeId),
    validarCampos
],usuarioDelete);

module.exports = router;