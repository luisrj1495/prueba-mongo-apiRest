const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')
 
// default options
app.use(fileUpload());
 
app.put('/upload/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo
    const id = req.params.id

  if (!req.files) {
    return res.status(400).json({
        ok:false,
        err: {
            message: 'NO se cargó el archivo'
        }
    });
  }

  const tiposValidos = ['productos', 'usuarios']
  if ( tiposValidos.indexOf(tipo) < 0){
    return res.status(400).json({
        ok: false,
        err: {
            message: 'EL tipo no es valido'
        }
    });
  }

    
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;

  //extensiones perimitadas

  const extensionesValidas = ['png','jpg','gif','jpeg']
  const nombreArchivo = archivo.name.split('.')
  const extension = nombreArchivo[nombreArchivo.length -1]
  console.log(extension)

  if ( extensionesValidas.indexOf(extension) < 0){
    return res.status(400).json({
        ok: false,
        err: {
            message: 'La extensión no es valida ' + extensionesValidas.join(', ')
        }
    });
  }

  //cambiar nombre al archivo
  const nombreArchi = `${id}-${new Date().getMilliseconds()}.${extension}`
 
  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchi}`, (err) => {
    if (err) {
        return res.status(500).json({
            ok: false,
            err: {
                message: err
            }
        });
     }

     tipo === 'usuarios' ? imagenUsuario(id, res, nombreArchi) : imagenProductos(id, res, nombreArchi)
     
  });
});


const imagenUsuario = (id, res, nombreArchi) => {

    Usuario.findById(id, (err, usuarioDB) => {
        if( err ) {
            borraArchivo(nombreArchi,'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB){
            borraArchivo(nombreArchi,'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img,'usuarios')
        

        usuarioDB.img = nombreArchi

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchi
            })
        })
    })


}
const imagenProductos = (id, res, nombreArchi) => {
    Producto.findById(id, (err, productoDB) => {
        if( err ) {
            borraArchivo(nombreArchi,'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            borraArchivo(nombreArchi,'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            })
        }

        borraArchivo(productoDB.img,'productos')

        productoDB.img = nombreArchi

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchi
            })
        })
    })

}


const borraArchivo = (nombreImagen, tipo) => {

    const pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`)
    fs.existsSync(pathImagen) && fs.unlinkSync(pathImagen)
}

module.exports = app