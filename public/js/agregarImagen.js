import { Dropzone } from 'dropzone'

const token = document.querySelector( 'meta[name="csrf-token"]' ).content

Dropzone.options.imagen = {
  dictDefaultMessage: 'Sube tus imágenes aquí',
  acceptedFiles: '.png,.jpg,.jpeg',
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProccesQueue: false,
  addRemoveLinks: true,
  dictRemoveFile: 'Eliminar imagen',
  dictMaxFilesExceeded: 'El límite es de 1 archivo',
  headers: {
    'CSRF-Token': token
  },
  paramName: 'imagen',
  init: function() {
    const dropzone = this
    const btnPublicar = document.querySelector( '#publicar' )

    btnPublicar.addEventListener( 'click', function() {
      dropzone.proccesQueue()
    } )

    dropzone.on( 'queuecomplete', function() {
      if ( dropzone.getActiveiles().length === 0 ) {
        window.location.href = '/mis-propiedades'
      }
    } )
  }
}
