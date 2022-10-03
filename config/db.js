const Sequelize = require('sequelize');
// extraer valores de variables.env
require('dotenv').config({ path: 'variables.env'});

//|'sqlite'|'postgres'|'mssql'
const sequelize = new Sequelize(
    process.env.BD_NOMBRE,
    process.env.BD_USER,
    process.env.BD_PASS, {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    
    define:{
        timestamp:false
    },

    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle:10000
    }
});

module.exports = sequelize;