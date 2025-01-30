import categorias from './categorias.js'
import pc from 'picocolors'
import precios from './precios.js'
import usuarios from './usuarios.js'
import { Categoria, Precio, Usuario } from '../models/index.js'
import db from '../config/db.js'

const importarDatos = async() => {
  try {
    await db.authenticate()

    await db.sync()

    await Promise.all( [
      Categoria.bulkCreate( categorias ),
      Precio.bulkCreate( precios ),
      Usuario.bulkCreate( usuarios )
    ] )

    console.log( pc.bgGreenBright( 'Datos agregados correctamente' ) )
    process.exit( 0 )
  } catch ( error ) {
    console.error( error )

    process.exit( 1 )
  }
}

const eliminarDatos = async() => {
  try {
    await db.sync( { force: true } )

    console.log( pc.bgRedBright( 'Datos eliminados correctamente' ) )
    process.exit( 0 )
  } catch ( error ) {
    console.error( error )

    process.exit( 1 )
  }
}

if ( process.argv[2] === '-i' ) {
  importarDatos()
}

if ( process.argv[2] === '-e' ) {
  eliminarDatos()
}
