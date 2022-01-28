const { Console } = require('console');
const { Transform } = require('stream');

require('colors');
const { Pool } = require('pg');

class Queries{

    constructor(){

        this.config = {
            user: 'postgres',
            host: 'localhost',
            database: 'alwaysmusic',
            password: '0000',
            port: 5432,
            max: 20,
            idleTimeoutMillis: 5000,
            connectionTimeoutMillis: 2000
        };

        this.pool = new Pool( this.config );
    }

    registrarEstudiante = async(input) => {
        
        const query = {
            name: 'register-student',
            rowMode: 'array',
            text: `INSERT INTO usuarios (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING*`,
            values: [`${input.nombre.toLowerCase()}`,`${input.rut}`,`${input.curso.toLowerCase()}`, `${input.nivel}`]
        }

        try {
            const client = await this.pool.connect();
            const res = await client.query(query);
            client.release();
            let estudiante = [];
            res.rows.map(r => {
                const infoEstudiante = {
                    id: r[0],
                    nombre: r[1],
                    rut: r[2],
                    curso: r[3],
                    nivel: r[4]
                };

            estudiante.push(infoEstudiante)
            return infoEstudiante;
            });

            console.log('\n======================================================'.brightGreen);
            console.log('  Estudiante agregado con la siguiente información:'.brightWhite);
            console.log('======================================================'.brightGreen);
            const nombreCapitalized = estudiante[0].nombre.charAt(0).toUpperCase() + estudiante[0].nombre.slice(1);
            const cursoCapitalized = estudiante[0].curso.charAt(0).toUpperCase() + estudiante[0].curso.slice(1);
            console.log('Nombre:'.brightGreen, nombreCapitalized);
            console.log('Rut   :'.brightGreen, estudiante[0].rut);
            console.log('Curso :'.brightGreen, cursoCapitalized);
            console.log('Nivel :'.brightGreen, estudiante[0].nivel);

            return estudiante;       
        } catch (error) {
            console.log(`El alumno con rut ${input.rut}, ya existe en la base de datos, verifique la información y vuelva a intentarlo.`.bgRed.brightWhite);
        }
    };

    obtenerTodosLosEstudiantes = async() => {
        const query = {
            name: 'get-all-students',
            rowMode: 'array',
            text: 'SELECT * FROM usuarios ORDER BY rut'
        }
        try {
            const client = await this.pool.connect();
            const res = await client.query(query);
            client.release();
            let estudianteArr = [];
            res.rows.map(r => {
                const infoEstudiante = {
                    id: r[0],
                    nombre: r[1],
                    rut: r[2],
                    curso: r[3],
                    nivel: r[4]
                };
            estudianteArr.push(infoEstudiante)
            return infoEstudiante;
            });
            if (res.rowCount > 0) {
            this.table(estudianteArr);
            return estudianteArr;
            }
            else{
            console.log('No hay registros en la base de datos, verifique la información y vuelva a intentarlo.'.bgRed.brightWhite);    
            }
        } catch (error) {
                console.log('No hay registros en la base de datos, verifique la información y vuelva a intentarlo.'.bgRed.brightWhite);
        }
    };

    obtenerEstudiante = async(rut) => {

        const query = {
            name: 'get-student',
            rowMode: 'array',
            text: `SELECT * FROM usuarios WHERE rut = $1 ORDER BY rut`,
            values: [`${rut}`]
        }
        
        try {
        const client = await this.pool.connect();
        const res = await client.query(query);
        client.release();
        let estudianteArr = [];
            res.rows.map(r => {
                const infoEstudiante = {
                    id: r[0],
                    nombre: r[1],
                    rut: r[2],
                    curso: r[3],
                    nivel: r[4]
                };
            estudianteArr.push(infoEstudiante)
            return infoEstudiante;
            });
        if (res.rowCount > 0) {
            this.table(estudianteArr);
            return estudianteArr;
        }else{
            console.log(`El usuario con rut ${rut} no existe en la base de datos, verifique la información y vuelva a intentarlo.`.bgRed.brightWhite);
        }    
        } catch (error) {
            console.log('No existe el alumno asociado al rut ingresado, verifique la información y vuelva a intentarlo.'.bgRed.brightWhite);
        }
    };

    actualizarEstudiante = async(estudiante) => {
        const query = {
            name: 'update-student',
            rowMode: 'array',
            text: `UPDATE usuarios SET nombre = $1, rut = $2, curso = $3, nivel = $4 WHERE id = $5 RETURNING*`,
            values: [`${estudiante.nuevoNombre.toLowerCase()}`,`${estudiante.nuevoRut}`, `${estudiante.nuevoCurso.toLowerCase()}`, `${estudiante.nuevoNivel}`, `${estudiante.estudianteID}`]
        }

        try {
            const client = await this.pool.connect();
            const res = await client.query(query);
            client.release();
            let estudianteArr = [];
            res.rows.map(r => {
                const infoEstudiante = {
                    id: r[0],
                    nombre: r[1],
                    rut: r[2],
                    curso: r[3],
                    nivel: r[4]
                };
            estudianteArr.push(infoEstudiante)
            return infoEstudiante;
            });
            if (res.rowCount > 0) {
                this.table(estudianteArr);
                return estudianteArr;
            }else{
                console.log(`El usuario con rut ${estudiante.rutActual} no existe en la base de datos, verifique la información y vuelva a intentarlo.`.bgRed.brightWhite);
                return;
            }    
        } catch (error) {
            console.log('No existe el alumno asociado al rut ingresado, verifique la información y vuelva a intentarlo.'.bgRed.brightWhite);
        }
    };

    eliminarEstudiante = async(estudiante) => {

        const query = {
            name: 'delete-student',
            rowMode: 'array',
            text: `DELETE FROM usuarios WHERE id = $1 RETURNING*`,
            values: [`${estudiante.id}`]
        }

        try {
            const client = await this.pool.connect();
            const res = await client.query(query);
            client.release();
            let estudianteArr = [];
            res.rows.map(r => {
                const infoEstudiante = {
                    id: r[0],
                    nombre: r[1],
                    rut: r[2],
                    curso: r[3],
                    nivel: r[4]
                };
            estudianteArr.push(infoEstudiante)
            return infoEstudiante;
            });
            this.table(estudianteArr);
            return estudianteArr;

        } catch (error) {
            console.log('No existe alumno con el rut ingresado, verifique la información y vuelva a intentarlo.'.bgRed.brightWhite);
        }
    };

    table = (input) => {
        const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
        const logger = new Console({ stdout: ts })
        logger.table(input)
        const table = (ts.read() || '').toString()
        let result = '';
        for (let row of table.split(/[\r\n]+/)) {
          let r = row.replace(/[^┬]*┬/, '┌');
          r = r.replace(/^├─*┼/, '├');
          r = r.replace(/│[^│]*/, '');
          r = r.replace(/^└─*┴/, '└');
          r = r.replace(/'/g, ' ');
          result += `${r}\n`;
        }
        console.log(result);
      };

      serverDisconnect = async() => {
          const client = await this.pool.connect();
          client.release();
          this.pool.end();
      }
};

module.exports = Queries;