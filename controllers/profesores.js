const { response, request } = require("express");
const { Profesor } = require("../models");

const obtenerProfesor = async (req=request,res=response) => {
    const query = { estado: true };
    const [profesores,total] = await Promise.all([
       // Profesor.find(query),
       Profesor.find(query).populate([{path: 'cursos.asignatura', select: ['nombre','hTeorica','hPractica']}]),
        Profesor.countDocuments(query),
    ]); 
     
    res.json({ total,profesores });
}
const obtenerProfesorPorID = async (req=request,res=response) => {
    const {id}= req.params;
    const profesor = await Profesor.findById(id).populate([{path: 'cursos.asignatura', select: ['nombre','hTeorica','hPractica']}]);
    res.json({ profesor });
}
const crearProfesor = async(req=request,res=response) => {
    const {estado,cursos,...data} =  req.body;
    // no quiero los cursos cuando estoy creando un profesor
    const profesor = new Profesor(data);
    await profesor.save();
    res.json({ profesor} );
}

const actualizarProfesor = async (req=request,res=response) => {
    const {id} = req.params;
    const {estado,...data} =  req.body;
    
    if (data.cedula) {

        const profesorDB = await Profesor.findOne({cedula:data.cedula});
        if (profesorDB && profesorDB._id != id) {
            return res.status(400).json({
                msg:`cedula duplicada ${profesorDB.nombre} ya existe`
            });
        }
        
    }

    const profesorDB = await Profesor.findByIdAndUpdate(id,data,{ new: true }).populate([{path: 'cursos.asignatura', select: ['nombre','hTeorica','hPractica']}]);
    
    res.json({ profesor:profesorDB });
}
const eliminarProfesor = async (req=request,res=response) => {
    const {id} = req.params;
    const profesorDB = await Profesor.findByIdAndUpdate(id,{estado:false},{ new: true });
    
    res.json({ profesorDB });
}

module.exports = {
    obtenerProfesor,
    obtenerProfesorPorID,
    crearProfesor,
    actualizarProfesor,
    eliminarProfesor,
}