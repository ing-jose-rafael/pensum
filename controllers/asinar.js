const { request, response } = require("express");
const { Profesor, Asignatura, UserProf, Materia, Curso } = require("../models");

const asignar = async (req, res) => {

    const { idProfe, idCurso, grupoTeoria = 0, grupoPractica = 0 } = req.body;

    // Profesor.findById(idProfe),
    const [profesor, curso] = await Promise.all([
        Profesor.findById(idProfe).populate([{ path: 'cursos.asignatura', select: ['nombre', 'hTeorica', 'hPractica'] }]),
        Asignatura.findById(idCurso),
    ]);
    // para no repetir el profesor asignandole el curso
    if (curso.profesores.includes(idProfe)) {
        return res.json({
            msg: 'El profesor ya tiene este curso asignado'
        });
    }
    // valida para saber si el numero de grupo que se desea asignar al profesor se puede 
    const gruteoriaDB = (curso.grupTeoria - curso.grupTeoriaAsig);
    const gruPractDB = (curso.grupPractica - curso.grupPracticaAsig);
    if (gruteoriaDB < grupoTeoria) {

        return res.json({
            msg: `Excede el número de grupo de teoria, disponibles: ${gruteoriaDB},`,

        });
    }
    if (gruPractDB < grupoPractica) {

        return res.json({
            msg: `Excede el número de Grupo de Práctica, disponibles: ${gruPractDB}`,
        });
    }

    curso.grupTeoriaAsig = curso.grupTeoriaAsig + grupoTeoria;
    curso.grupPracticaAsig = curso.grupPracticaAsig + grupoPractica;

    // agregando las horas asignadas al profesor
    profesor.horasAsi = profesor.horasAsi + (curso.hTeorica * grupoTeoria) + (curso.hPractica * grupoPractica);

    const asignatura = {
        asignatura: curso._id,
        codigo: curso.codigo,
        grupoTeoria: grupoTeoria,
        grupoPractica: grupoPractica,
        horaTeoria: curso.hTeorica,
        horaPractica: curso.hPractica,
    }
    // agregando las asignatura al profesor 
    profesor.cursos.push(asignatura);

    curso.profesores.push(idProfe);

    const [profesorSave, cursoSave] = await Promise.all([
        profesor.save(),
        curso.save(),
    ]);
    const prof = await Profesor.findById(idProfe).populate([{ path: 'cursos.asignatura', select: ['nombre', 'hTeorica', 'hPractica'] }]);

    res.json({ msg: 'ok', profesor: prof, curso: cursoSave });
}



const asinaciones = async (req = request, res = response) => {
    const { idProfe, idCurso, grupoTeoria = 0, grupoPractica = 0 } = req.body;
    // const rep = await Materia.find({codigo:idCurso});
    const [profesorDB, asignatura, cursos] = await Promise.all([
        UserProf.findById({ _id: idProfe }).sort({ _id: -1 }),
        Materia.findById({ _id: idCurso }).sort({ _id: -1 }),
        Curso.find()
    ]);

    if (!profesorDB) {
        return res.status(404).json({
            msg: 'No existe el profesor con el id ' + idProfe
        });
    }

    if (!asignatura) {
        return res.status(404).json({
            msg: 'No existe la asignatura con el id ' + idCurso
        });
    }

    const { cantGrupTeoriaAsig, cantGrupPractAsig } = cursos.reduce((count, mat) => {
        if (mat.curso.valueOf() === asignatura._id.valueOf()) {
            count.cantGrupTeoriaAsig += mat.grupTeoriaAsig
            count.cantGrupPractAsig += mat.grupPracticaAsig
        }
        return count
    }, { cantGrupTeoriaAsig: 0, cantGrupPractAsig: 0 })

    const dispoTeor = asignatura.grupTeoria - cantGrupTeoriaAsig
    if (dispoTeor < grupoTeoria) {
        return res.status(400).json({ msg: `Excede el número de grupo de teoria, disponibles` });
    }

    const dispoPract = asignatura.grupPractica - cantGrupPractAsig
    if (dispoPract < grupoPractica) {
        return res.status(400).json({ msg: `Excede el número de grupo de Práctica, disponibles` });
    }

    // const resp = cursos.find(({profesor,curso}) => profesor === "63d1399c10d850286589fa25" )
    const resp = cursos.some(e => e.profesor.valueOf() === profesorDB._id.valueOf() && e.curso.valueOf() === asignatura._id.valueOf())

    if (resp) {
        return res.status(400).json({ msg: "El profesor ya tiene este curso asignado" });
    }
    // TODO: validar el tope de horas del profesor

    const asinacion = {
        profesor: profesorDB,
        curso: asignatura,
        grupTeoriaAsig: grupoTeoria,
        grupPracticaAsig: grupoPractica
    }

    const asin = new Curso(asinacion);
    await asin.save();
    res.status(200).json({ msg: 'ok', profesor: profesorDB, curso: asin });
}

const eliAsignacion = async (req = request, res = response) => {
    const { id } = req.params
    const data = await Curso.findById(id).exec()
    if (!data) {
        return res.status(404).json({
            msg: 'No existe con el id ' + id
        });
    }
    let deleted = await Curso.deleteOne({ _id: id })
    return res.json({ msg: 'Asignación eliminada', eliminado: deleted.deletedCount, id });
}

const editAsignacion = async (req = request, res = response) => {
    const { id } = req.params;
    const { idProfe, idCurso, grupoTeoria = 0 , grupoPractica = 0 } = req.body
    
    if ( grupoTeoria === 0 && grupoPractica === 0 ) {
        return res.json({
            msg: `No se puede dejar los grupos sin asignacion`,
        });
    }

    const [existe,asignaciones,curso,profesor] = await Promise.all([
        Curso.findById({ _id: id }).sort({ _id: -1 }),
        Curso.find(),
        Materia.findById({ _id: idCurso }).sort({ _id: -1 }),
        UserProf.findById({ _id: idProfe }).sort({ _id: -1 }),
    ]) 

    if (!existe) {
        return res.status(404).json({
            msg: 'No existe con el id ' + id,
        })
    }

    // validar disponibilidad de grupos ha asignar
    const { cantGrupTeoriaAsig, cantGrupPractAsig } = asignaciones.reduce((count, mat) => {
        if (existe.curso.valueOf() === mat.curso.valueOf() && profesor._id.valueOf() !== mat.profesor.valueOf()) {
            count.cantGrupTeoriaAsig += mat.grupTeoriaAsig
            count.cantGrupPractAsig += mat.grupPracticaAsig
        }
        return count
    }, { cantGrupTeoriaAsig: 0, cantGrupPractAsig: 0 })

    console.log(cantGrupTeoriaAsig);
    console.log(asignaciones);

    const dispoTeor = curso.grupTeoria - cantGrupTeoriaAsig 
    if (dispoTeor < grupoTeoria) {
        return res.status(400).json({ msg: `Excede el número de grupo de teoria, disponibles: ${dispoTeor}` });
    }

    const dispoPract = curso.grupPractica - cantGrupPractAsig 
    if (dispoPract < grupoPractica) {
        return res.status(400).json({ msg: `Excede el número de grupo de Práctica, disponibles: ${dispoPract}` });
    }

    const newAs = {
        profesor,
        curso,
        grupTeoriaAsig: grupoTeoria,
        grupPracticaAsig: grupoPractica
    }
    const newAsig = await Curso.findOneAndUpdate({ _id: id }, { ...newAs  }, {
        new: true
    })

    res.json({ msg: 'ok',newAsig });
}



const editarAsignacion = async (req, res) => {
    const { idP, idC } = req.params;
    const { ...data } = req.body;

    const [profesor, curso] = await Promise.all([
        Profesor.findById(idP).populate([{ path: 'cursos.asignatura', select: ['nombre', 'hTeorica', 'hPractica'] }]),
        Asignatura.findById(idC),
    ]);

    const { asignatura, grupoTeoria, grupoPractica } = profesor.cursos.find(element =>
        element.asignatura._id == idC
    );
    if (data.grupoTeoria == 0 && data.grupoPractica == 0) {
        return res.json({
            msg: `No se puede, dejar los grupos sin asignacion`,
        });
    }
    if (data.grupoTeoria >= 0) {

        curso.grupTeoriaAsig = curso.grupTeoriaAsig - grupoTeoria + data.grupoTeoria;

        const gruteoriaDB = (curso.grupTeoria - curso.grupTeoriaAsig);
        // const gruPractDB = (curso.grupPractica - curso.grupPracticaAsig);
        if (gruteoriaDB < 0) {
            return res.json({
                msg: `No se puede, excede el numero de grupos`,
            });
        }
        var grupoTeoriaAnte;
        // guardar
        const cursos = profesor.cursos.map(curso => {
            if (curso.asignatura._id == idC) {
                grupoTeoriaAnte = curso.grupoTeoria;
                curso.grupoTeoria = data.grupoTeoria;
            }
            return curso;
        });

        // agregando las horas asignadas al profesor
        profesor.horasAsi = profesor.horasAsi + (curso.hTeorica * (data.grupoTeoria - grupoTeoriaAnte));


        //curso.save();
        await Promise.all([
            profesor.save(),
            curso.save(),
        ]);


    }
    if (data.grupoPractica >= 0) {

        curso.grupPracticaAsig = curso.grupPracticaAsig - grupoPractica + data.grupoPractica;

        const gruPractDB = (curso.grupPractica - curso.grupPracticaAsig);
        // const gruPractDB = (curso.grupPractica - curso.grupPracticaAsig);
        if (gruPractDB < 0) {
            return res.json({
                msg: `No se puede, excede el numero de grupos`,
            });
        }
        var grupoPractAnte;
        // guardar
        const cursos = profesor.cursos.map(elemet => {
            if (elemet.asignatura._id == idC) {
                grupoPractAnte = elemet.grupoPractica;
                elemet.grupoPractica = data.grupoPractica;
            }
            return curso;
        });

        // agregando las horas asignadas al profesor
        profesor.horasAsi = profesor.horasAsi + (curso.hPractica * (data.grupoPractica - grupoPractAnte));


        //curso.save();
        await Promise.all([
            profesor.save(),
            curso.save(),
        ]);


    }
    // if (data.grupoPractica>=0) {

    //     curso.grupPracticaAsig = curso.grupPracticaAsig - grupoPractica + data.grupoPractica;

    //     const gruPractDB = (curso.grupPractica - curso.grupPracticaAsig);
    //     // const gruPractDB = (curso.grupPractica - curso.grupPracticaAsig);
    //     if ( gruPractDB < 0 ) {
    //         return res.json({
    //             msg:`No se puede, excede el numero de grupos Pracica`,
    //         });
    //     }
    //     var grupoPractAnte;
    //     // guardar
    //    profesor.cursos.map( curso =>{
    //         if (curso.asignatura._id==idC) {
    //             grupoPractAnte = data.grupoPractica;
    //             curso.grupPractica = data.grupoPractica;
    //         }
    //         return curso;
    //    });

    //    profesor.horasAsi = profesor.horasAsi + (curso.hPractica * (data.grupoPractica-grupoPractAnte));
    //     // curso.save();
    //     // const [ updateProf, updateCuros ] = await Promise.all([
    //     //     profesor.save(),
    //     //     curso.save(),
    //     // ]);
    //     await Promise.all([
    //         profesor.save(),
    //         curso.save(),
    //     ]);
    //     //return res.json({ msg:'ok',profesor,cursos });
    // }

    res.json({ msg: 'ok', profesor, curso });
}

const eliminarAsignacion = async (req, res) => {
    const { idP, idC } = req.params;
    const [profesor, curso] = await Promise.all([
        Profesor.findById(idP).populate([{ path: 'cursos.asignatura', select: ['nombre', 'hTeorica', 'hPractica'] }]),
        // Profesor.findById(idP),
        Asignatura.findById(idC),
    ]);


    const { grupoTeoria, grupoPractica } = profesor.cursos.find(element =>
        element.asignatura._id == idC
    );

    curso.grupTeoriaAsig = curso.grupTeoriaAsig - grupoTeoria;
    curso.grupPracticaAsig = curso.grupPracticaAsig - grupoPractica;
    // eliminar las horas asignadas al profesor
    profesor.horasAsi = profesor.horasAsi - ((curso.hTeorica * grupoTeoria) + (curso.hPractica * grupoPractica));

    // // filtra de profesor del arreglo cursos donde el id de la asignatura no es igual al psado
    const cursos = profesor.cursos.filter(curso => curso.asignatura._id != idC);
    profesor.cursos.splice(0, profesor.cursos.length);
    profesor.cursos.push(...cursos);

    const profesores = curso.profesores.filter(p => p != idP); // filtra en el array de string el id del profesor
    curso.profesores.splice(0, curso.profesores.length);
    curso.profesores.push(...profesores);

    // await Promise.all([
    //     profesor.save(),
    //     curso.save(),
    // ]);
        console.log({profesor,curso, grupoTeoria, grupoPractica});
    res.json({ profesor, curso, grupoTeoria, grupoPractica });
}



module.exports = {
    asignar,
    editarAsignacion,
    eliminarAsignacion,
    asinaciones,
    eliAsignacion,
    editAsignacion
}