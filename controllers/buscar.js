const { response,request } = require("express");
const { ObjectId } = require('mongoose').Types;
const {Usuario,Categoria,Producto, Profesor} = require('../models');
// colecciones permitidas para realizar la busqueda
const coleccionesPermitidas = [
    'categorias',
    'categoria',
    'productos',
    'roles',
    'usuarios',
    'profesores',
];
const buscar = (req=request,res=response)=>{
    const {coleccion,termino } = req.params;
    // si la coleccion que recibo esta en las permitidas
    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }
    // de acuerdo a la coleccion realiza la busqueda
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'categoria':
            buscarProductPorCategoria(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
        case 'profesores':
            buscarProfesor(termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }
}
const buscarCategorias = async (termino='',res = response) => {
    // Validamos si el termino es un mongoID o el nombre de usuario
    const esMongoID = ObjectId.isValid( termino ); // TRUE 
    
    // si es un ID el termino
    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        // si no exite el usuario retorna un arreglo vacio
        // todas las respuesta serán estandarizadas
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }
    // el termino es una palabra no es un ID
    const regex = new RegExp( termino, 'i' ); // insencible a las mayusculas
    const categoria = await Categoria.find({
        nombre: regex, 
        estado: true 
    });

    res.json({ results: categoria });

}
const buscarProductPorCategoria = async (termino='',res = response) => {
    // Validamos si el termino es un mongoID o el nombre de usuario
    const esMongoID = ObjectId.isValid( termino ); // TRUE 
    
    // si es un ID el termino
    if ( esMongoID ) {
        const categoria = await Producto.find({categoria:ObjectId(termino)}).populate([{path: 'usuario', select: 'nombre'}, {path: 'categoria', select: 'nombre'}]);
        // si no exite el usuario retorna un arreglo vacio
        // todas las respuesta serán estandarizadas
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }
    // el termino es una palabra no es un ID
    const regex = new RegExp( termino, 'i' ); // insencible a las mayusculas
    const categoria = await Categoria.findOne({
        nombre: regex, 
        estado: true 
    });
    
    const product = await Producto.find({categoria:categoria._id}).populate([{path: 'usuario', select: 'nombre'}, {path: 'categoria', select: 'nombre'}]);
    res.json({ results: product });

}
const buscarProductos = async (termino='',res = response) => {
    // Validamos si el termino es un mongoID o el nombre de usuario
    const esMongoID = ObjectId.isValid( termino ); // TRUE 
    if (esMongoID) {
        const producto = await Producto.findById(termino)
                            .populate([{path: 'usuario', select: 'nombre'}, {path: 'categoria', select: 'nombre'}]);
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }
    const regex = new RegExp( termino, 'i' ); // insencible a las mayusculas
    
    const producto = await Producto.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    }).populate([{path: 'usuario', select: 'nombre'}, {path: 'categoria', select: 'nombre'}]);
    res.json({
        results: producto
    });
} 
const buscarUsuarios = async( termino = '', res = response ) => {
    
    // Validamos si el termino es un mongoID o el nombre de usuario
    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        // si no exite el usuario retorna un arreglo vacio
        // todas las respuesta serán estandarizadas
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // insencible a las mayusculas
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });

}
const buscarProfesor = async( termino = '', res = response ) => {
    
    // Validamos si el termino es un mongoID o el nombre de usuario
    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const profesor = await Profesor.findById(termino).populate([{path: 'cursos.asignatura', select: ['nombre','hTeorica','hPractica']}]);
        // si no exite el usuario retorna un arreglo vacio
        // todas las respuesta serán estandarizadas
        return res.json({
            total:( profesor ) ?1:0,
            profesores: ( profesor ) ? [ profesor ] : []
        });
    }

    const regex = new RegExp( termino, 'i' ); // insencible a las mayusculas
    const profesores = await Profesor.find({
        $or: [{ nombre: regex }, { cedula: regex }],
        $and: [{ estado: true }]
    }).populate([{path: 'cursos.asignatura', select: ['nombre','hTeorica','hPractica']}]);

    res.json({
        total:profesores.length,
        profesores: profesores
    });

}

module.exports = {buscar}