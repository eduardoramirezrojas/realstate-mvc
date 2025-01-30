import express from 'express'
import csurf from 'csurf'
import cookieParser from 'cookie-parser'
import pc from 'picocolors'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

const app = express()

app.use( express.urlencoded( { extended: true } ) )

app.use( cookieParser() )

app.use( csurf( { cookie: true } ) )

try {
  await db.authenticate()
  db.sync()
  console.log( pc.bgBlue( 'Coneccion exitosa a la base de datos' ) )
} catch ( error ) {
  console.error( error )
}

app.set( 'view engine', 'pug' )
app.set( 'views', './views' )

app.use( express.static( 'public' ) )

app.use( '/', appRoutes )
app.use( '/auth', usuarioRoutes )
app.use( '/', propiedadesRoutes )
app.use( '/api', apiRoutes )

const port = 3000
app.listen( port, () => {
  console.log( pc.bgGreenBright( `El Servidor está funcionando en el puerto ${port}` ) )
} )
