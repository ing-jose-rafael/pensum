const { response, request } = require('express');
const { validationResult } = require('express-validator');
/// funcion para validar errores campos
const validarCampos = (req=request, res=response,next)=>{
    const errors  = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next();
    
}

module.exports={
    validarCampos
}