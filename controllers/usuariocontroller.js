import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generarID, generarJWT } from '../helpers/tokens.js'
import { emailOlvidePassword, emailRegistro } from '../helpers/emails.js'

const formLogin = ( req, res ) => {
  res.render( 'auth/login', {
    pagina: 'Iniciar sesion',
    csrfToken: req.csrfToken()
  } )
}

const autenticar = async( req, res ) => {
  await check( 'email' )
    .isEmail()
    .withMessage( 'El email es obligatorio' )
    .run( req )

  await check( 'password' )
    .withMessage( 'La contraseña debe ser al menos de 6 caracteres' )
    .run( req )

  const resultado = validationResult()

  if ( !resultado.isEmpty() ) {
    return res.render( 'auth/login', {
      pagina: 'Iniciar sesión',
      csrfToken: req.csrfToken(),
      errores: resultado.array()
    } )
  }

  const { email, password } = req.body

  const usuario = await Usuario.findOne( { where: { email } } )

  if ( !usuario ) {
    return res.render( 'auth/login', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errores: [ { msg: 'El usuario no existe' } ]
    } )
  }

  if ( !usuario.confimado ) {
    return res.render( 'auth/login', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errores: [ { msg: 'Tu cuenta no ha sido confirmada' } ]
    } )
  }

  if ( !usuario.verificarPassword( password ) ) {
    return res.render( 'auth/login', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errores: [ { msg: 'La contraseña es incorrecta' } ]
    } )
  }

  const token = generarJWT( { id: usuario.id, nombre: usuario.nombre } )

  return res.cookie( '_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: true
  } ).redirect( '/mis-propiedades' )
}

const cerrarSesion = async (req, res) => {
  return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formRegistro = ( req, res ) => {
  res.render( 'auth/registro', {
    pagina: 'Crear cuenta',
    csrfToken: req.csrfToken()
  } )
}

const registrar = async( req, res ) => {
  await check( 'nombre' )
    .notEmpty()
    .withMessage( 'El nombre no puede ir vacio' )
    .run( req )

  await check( 'email' ).isEmail().withMessage( 'email inválido' ).run( req )

  await check( 'password' )
    .isLength( { min: 6 } )
    .withMessage( 'La contraseña debe ser al menos de 6 caracteres' )
    .run( req )

  await check( 'password' )
    .equals( 'password' )
    .withMessage( 'La contraseñas no coinciden' )
    .run( req )

  const resultado = validationResult( req )

  const { nombre, email, password } = req.body

  if ( !resultado.isEmpty() ) {
    return res.render( 'auth/registro', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre,
        email
      }
    } )
  }

  const existeUsuario = await Usuario.findOne( {
    where: { email }
  } )

  if ( existeUsuario ) {
    return res.render( 'auth/registro', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errores: [ { msg: 'El usuario ya está registrado' } ],
      usuario: {
        nombre,
        email
      }
    } )
  }

  const usuario = await Usuario.create( {
    nombre,
    email,
    password,
    token: generarID()
  } )

  emailRegistro( {
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  } )

  res.render( 'templates/mensaje', {
    pagina: 'Cuenta creada correctamente',
    mensaje: 'Hemos enviado un email de confirmacion, revise su correo'
  } )
}

const confimar = async( req, res ) => {
  const { token } = req.params

  const usuario = Usuario.findOne( { where: { token } } )

  if ( !usuario ) {
    return res.render( 'auth(confirmar-cuenta', {
      pagina: 'Error al confirmar tu cuenta',
      mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
      error: true
    } )
  }

  usuario.token = null
  usuario.confimado = true
  await usuario.save()

  return res.render( 'auth(confirmar-cuenta', {
    pagina: 'Cuenta confirmaad',
    mensaje: 'La cuenta se confirmo correctamente'
  } )
}

const formOlvidePassword = ( req, res ) => {
  res.render( 'auth/olvide-password', {
    pagina: 'Recupera tu acceso',
    csrfToken: req.csrfToken()
  } )
}

const resetPassword = async( req, res ) => {
  await check( 'email' ).isEmail().withMessage( 'email inválido' ).run( req )
  const resultado = validationResult( req )

  if ( !resultado.isEmpty() ) {
    return res.render( 'auth/olvide-password', {
      pagina: 'Recupera tu acceso',
      csrfToken: req.csrfToken(),
      errores: resultado.array()
    } )
  }

  const { email } = req.body
  const usuario = await Usuario.findOne( { where: { email } } )

  if ( !usuario ) {
    return res.render( 'auth/olvide-password', {
      pagina: 'Recupera tu acceso',
      csrfToken: req.csrfToken(),
      errores: [ { msg: 'El email no pertenece a ningún usuario' } ]
    } )
  }

  usuario.token = generarID()

  await usuario.save()

  emailOlvidePassword( {
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token
  } )

  res.render( 'templates/mensaje', {
    pagina: 'Reestablece tu contraseña',
    mensaje: 'Hemos enviado un email, revise su correo'
  } )
}

const comprobarToken = async( req, res ) => {
  const { token } = req.params

  const usuario = await Usuario.findOne( { where: { token } } )

  if ( !usuario ) {
    return res.render( 'auth(confirmar-cuenta', {
      pagina: 'Reestablece tu contraseña',
      mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
      error: true
    } )
  }

  res.render( 'auth/reset-password', {
    pagina: 'Reestablece tu contraseña',
    csrfToken: req.csrfToken()
  } )
}

const nuevoPassword = async( req, res ) => {
  await check( 'password' )
    .isLength( { min: 6 } )
    .withMessage( 'La contraseña debe ser al menos de 6 caracteres' )
    .run( req )

  const resultado = validationResult()

  if ( !resultado.isEmpty() ) {
    return res.render( 'auth/registro', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errores: resultado.array()
    } )
  }

  const { token } = req.params
  const { password } = req.body

  const usuario = await Usuario.findOne( { where: { token } } )

  const salt = await bcrypt.genSalt( 10 )
  usuario.password = await bcrypt.hash( password, salt )
  usuario.token = null
  await usuario.save()

  res.render( 'auth/confirmar-cuenta', {
    pagina: 'Reestablecer contraseña',
    mensaje: 'La contraseña se guardó correctamente'
  } )
}

export { formLogin, autenticar, cerrarSesion, formRegistro, registrar, confimar, formOlvidePassword, resetPassword, comprobarToken, nuevoPassword }
