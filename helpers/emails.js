import nodemailer from 'nodemailer'

const emailRegistro = async( datos ) => {
  const transport = nodemailer.createTransport( {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  } )

  const { email, nombre, token } = datos

  await transport.sendMail( {
    from: 'bienesraices.com',
    to: email,
    subject: 'Confirma tu cuenta en bienesraices.com',
    text: 'Confirma tu cuenta en bienesraices.com',
    html: `
        
            <p>Hola ${nombre}, confirma tu cuenta en biensraices.com</p>

            <p>Tu cuenta ya está lista, solo debes confirmarlo en el siguiente enlace:</p>

            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a>

            <p>Si no creaste esta cuenta, ignora este mensaje</p>
        
        `
  } )
}

const emailOlvidePassword = async( datos ) => {
  const transport = nodemailer.createTransport( {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  } )

  const { email, nombre, token } = datos

  await transport.sendMail( {
    from: 'bienesraices.com',
    to: email,
    subject: 'Reestablece tu contraseña en bienesraices.com',
    text: 'Reestablece tu contraseña en bienesraices.com',
    html: `
        
            <p>Hola ${nombre}, has solicitado reestablecer tu contraseña</p>

            <p>Abre el siguiente enlace para generar una contraseña nueva:</p>

            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer contraseña</a>

            <p>Si no creaste solicitaste el cambio de contraseña, ignora este mensaje</p>
        
        `
  } )
}

export { emailRegistro, emailOlvidePassword }
