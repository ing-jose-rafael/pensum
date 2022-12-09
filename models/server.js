const express = require ('express');
var cors = require('cors');
const { dbConnection } = require('../database/configDB');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //paths de rutas
        this.paths = {
            auth: '/api/auth',
            asignaturas: '/api/asignaturas',
            asignar: '/api/asignar',
            buscar: '/api/buscar',
            categories: '/api/categorias',
            products: '/api/productos',
            profesores: '/api/profesores',
            users: '/api/usuarios',
        }
        
       // conectar a la DB
       this.conectarDB();     

        // Middleware
        this.middlewares();

        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );
         // lectura y parceo json
         this.app.use( express.json() );
        // Directorio público
        this.app.use(express.static('public'));

    }

    // rutas
    routes(){
        // middleware condicional pasa por la ruta
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.asignaturas,require('../routes/asignaturas'));
        this.app.use(this.paths.asignar,require('../routes/asignar'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        this.app.use(this.paths.categories,require('../routes/categorias'));
        this.app.use(this.paths.products, require('../routes/productos'));
        this.app.use(this.paths.profesores, require('../routes/profesores'));
        this.app.use(this.paths.users, require('../routes/usuarios'));
    }
    // para estar escuchando
    listen(){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en puerto',process.env.PORT);
        });
    }

}

module.exports = Server;