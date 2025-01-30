import express from 'express'
import {
  autenticar,
  cerrarSesion,
  comprobarToken,
  confimar,
  formLogin,
  formOlvidePassword,
  formRegistro,
  nuevoPassword,
  registrar,
  resetPassword
} from '../controllers/usuariocontroller.js'

const router = express.Router()

// Routing

router.get( '/login', formLogin )

router.get( '/login', autenticar )

router.post('/cerrar-sesion', cerrarSesion)

router.get( '/registro', formRegistro )
router.post( '/registro', registrar )

router.get( '/confirmar/:token', confimar )

router.get( '/olvide-password', formOlvidePassword )

router.get( '/olvide-password', resetPassword )

router.get( '/olvide-password/:token', comprobarToken )

router.get( '/olvide-password/:token', nuevoPassword )

export default router
