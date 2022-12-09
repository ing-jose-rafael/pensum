const { response } = require('express');
const {Categoria} = require('../models');

const obtenerCategoria = async (req, res = response) => {
    const {limite=10,desde = 0} = req.query;
    const query = { estado: true };
    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate({ path: 'usuario', select: 'nombre' })
            .skip( Number( desde ))    
            .limit(Number(limite)),
    ]);
    // const categorias = await Categoria.find().populate({ path: 'usuario', select: 'nombre' });
    res.json({
        total,
        categorias

    })
}
const obtenerCategoriaById = async (req, res = response) => {
    const { id } = req.params;
    const categorias = await Categoria.findById(id).populate({ path: 'usuario', select: 'nombre' });
    res.json({
        categorias
    })
}
const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    // buscando si existe una categoria con ese nombre
    const categoriaDB = await Categoria.findOne({nombre});
    // console.log(!categoriaDB);
    if (categoriaDB) {
        return res.status(400).json({
            msg:`la categoria ${categoriaDB.nombre} ya existe`
        });
    }
    // creamos la data
    // como paso la validacion previa del JWT ya tenemos el usuario en la req
    const data = {
        nombre,
        usuario:req.usuario._id,
    }
    // creando la categoria
    const categoria = new Categoria(data);
    // guardando en la BD
    await categoria.save();
    res.status(201).json({ categoria });
}
const actualizarCategoria = async (req, res = response) => {
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();
    // buscando si existe una categoria con ese nombre
     /** Creano un arreglo de promesas utilizamos una desectruturacion de arreglos */    
    // const [categoriaName,categoriaID] = await Promise.all([
    //     Categoria.findOne({nombre}),
    //     Categoria.findById({id}),

    // ]);
    const categoriaName = await Categoria.findOne({nombre});
    if (categoriaName) {
        return res.status(400).json({
            msg:`la categoria ${categoriaName.nombre} ya existe`
        });
    }
    // creamos la data
    // como paso la validacion previa del JWT ya tenemos el usuario en la req
    const data = {
        nombre,
        usuario:req.usuario._id,
    }
    const categoria = await Categoria.findByIdAndUpdate(id,data,{ new: true });
    // Actualizando la categoria
    res.json({
        msg:'categoria PUT',
        categoria
    })
}
const eliminarCategoria = async (req, res = response) => {
    const {id} = req.params;
     // creamos la data
    // como paso la validacion previa del JWT ya tenemos el usuario en la req
    const data = {
        
        usuario:req.usuario._id,
        estado:false
    }
    const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true})
    res.json({
        categoria
        
    })
}

module.exports = {
    obtenerCategoria,
    obtenerCategoriaById,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
}