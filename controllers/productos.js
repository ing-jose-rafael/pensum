const { response } = require('express');
const {Producto} = require('../models');

const obtenerProdutos = async (req, res=response)=>{
    const {limite=10,desde = 0} = req.query;
    const query = { estado: true };

    const [total,categorias] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate([{path: 'usuario', select: 'nombre'}, {path: 'categoria', select: 'nombre'}])
            .skip( Number( desde ))    
            .limit(Number(limite)),
    ]);
    // const categorias = await Categoria.find().populate({ path: 'usuario', select: 'nombre' });
    res.json({
        total,
        categorias

    })
}
const obtenerProdutosPorId = async (req, res=response)=>{
    const { id } = req.params;
    const producto = await Producto.findById(id).populate([{path: 'usuario', select: 'nombre'}, {path: 'categoria', select: 'nombre'}]);
    res.json({
        producto
    })
}
const crearProduto = async (req, res=response)=>{
    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });
    
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }
    
    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    const producto = new Producto( data );

    // guardar el producto
    const nuevoProducto =  await producto.save();
    
    await nuevoProducto.populate([{path: 'usuario', select: 'nombre'}, {path: 'categoria', select: 'nombre'}]);
    
    res.status(201).json( nuevoProducto );
}
const editarProduto = async (req, res=response)=>{
    const {id} = req.params;
    const { estado, usuario, ...data } = req.body;
    
    data.usuario = req.usuario._id;
    
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();

        const productoDB = await Producto.findOne({nombre:data.nombre});
        if (productoDB && productoDB._id!=id) {
            return res.status(400).json({
                msg:`el producto ${productoDB.nombre} ya existe`
            });
        }
    }
    
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({producto});
}
const eliminarProduto = async (req, res=response)=>{
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id,{estado:false},{new:true}); 
    res.json({productoBorrado});
}

module.exports={obtenerProdutos,obtenerProdutosPorId,crearProduto,editarProduto,eliminarProduto}