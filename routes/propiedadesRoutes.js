import express from "express";
import { body } from "express-validator";
import {
  admin,
  agregarImagen,
  almacenarImagen,
  crear,
  editar,
  eliminar,
  cambiarEstado,
  guardar,
  guardarCambios,
  mostrarPropiedad,
  enviarMensaje,
  verMensajes,
} from "../controllers/propiedadController.js";
import protegerRuta from "../middlewate/protegerRuta.js";
import upload from "../middlewate/subirImagen.js";
import { identificarUsuario } from "../middlewate/identificarUsuario.js";

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, admin);

router.get("/propiedades/crear", protegerRuta, crear);

router.post(
  "/propiedades/crear",
  protegerRuta,
  body("titulo").notEmpty().withMessage("El título del anuncio es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion del anuncio no puede estar vacia")
    .isLength({ max: 200 })
    .withMessage("La descripcion es muy larga"),
  body("categoria").isNumeric().withMessage("Selecciona una categoría"),
  body("precio").isNumeric().withMessage("Selecciona un rango de precio"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona una cantidad de habitaciones"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Selecciona una cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Selecciona una cantidad de baños"),
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),

  guardar
);

router.get("/propiedades/agregar-imagen/:id", protegerRuta, agregarImagen);

router.post(
  "/propiedades/agregar-imagen/:id",
  protegerRuta,
  upload.single("imagen"),
  almacenarImagen
);

router.get("/propiedades/editar/:id", protegerRuta, editar);

router.post(
  "propiedades/editar/:id",
  body("titulo").notEmpty().withMessage("El título del anuncio es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion del anuncio no puede estar vacia")
    .isLength({ max: 200 })
    .withMessage("La descripcion es muy larga"),
  body("categoria").isNumeric().withMessage("Selecciona una categoría"),
  body("precio").isNumeric().withMessage("Selecciona un rango de precio"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona una cantidad de habitaciones"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Selecciona una cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Selecciona una cantidad de baños"),
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
  guardarCambios
);

router.post("/propiedades/eliminar/:id", protegerRuta, eliminar);

router.put("/propiedades/:id", 
  protegerRuta,
  cambiarEstado
);

router.get("/propiedad/:id", protegerRuta, mostrarPropiedad);

router.get("/propiedad/:id", identificarUsuario, mostrarPropiedad);

router.post(
  "/propiedad/:id",
  identificarUsuario,
  body("mensaje")
    .isLength({ min: 10 })
    .withMessage("El mensaje no puede ir vacio o es muy corto"),
  enviarMensaje
);

router.get("/mensajes/:id", protegerRuta, verMensajes);

export default router;
