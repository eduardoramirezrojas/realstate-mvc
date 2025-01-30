import multer from 'multer'
import path from 'path'
import { generarID } from '../helpers/tokens'

const storage = multer.diskStorage( {
  destination: function( req, file, callback ) {
    callback( null, './public/uploads' )
  },
  filename: function( req, file, callback ) {
    callback( null, generarID(), path.extname( file.originalname ) )
  }
} )

const upload = multer( { storage } )

export default upload
