const { request, response } = require("express");
const {Asignatura} = require("../models");


const obtenerAsignatura = async (req=request, res=response) => {
    const [asignaturas,total] = await Promise.all([
        Asignatura.find(),
        Asignatura.countDocuments(),
    ]);
     
    res.json({total,asignaturas});
}
const obtenerAsignaturaID = async (req=request, res=response) => {
    const {id} = req.params;
    const asignaturas = await Asignatura.findById(id);
    res.json({asignaturas});
}
const crearAsignatura = async (req=request, res=response) => {
    
    const {estado,...data} = req.body;
    data.profesores=[];
    const asignatura = new Asignatura(data)
    await asignatura.save();
    res.status(201).json({asignatura});
}
const actualizarAsignatura = async (req=request, res=response) => {
    const {id} = req.params;
    const {estado,...data} =  req.body;

    if (data.codigo) {
        const asignaturaDB = await Asignatura.findOne({codigo:data.codigo});
        if (asignaturaDB && asignaturaDB._id != id) {
            return res.status(400).json({
                msg:`Codigo duplicado ya existe en la DB`
            });
        }
    }
    if (data.nombre) {
        const asignaturaDB = await Asignatura.findOne({nombre:data.nombre});
        if (asignaturaDB && asignaturaDB._id != id) {
            return res.status(400).json({
                msg:`Nombre duplicado ya existe en la DB`
            });
        }
    }

    const asignatura = await Asignatura.findByIdAndUpdate(id,data,{ new: true });
    res.json({asignatura});
}
const eliminarAsignatura = async(req=request, res=response) => {
    const {id} = req.params;
    const asignatura = await Asignatura.findByIdAndUpdate(id,{estado:false},{ new: true });
    res.json({asignatura});
}
module.exports = {
    obtenerAsignatura,
    obtenerAsignaturaID,
    crearAsignatura,
    actualizarAsignatura,
    eliminarAsignatura,
}