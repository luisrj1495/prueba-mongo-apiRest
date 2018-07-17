const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const Usuario = require('../models/usuario')

const app = express()

app.post('/usuario', function (req, res) {
    //aqui se obtiene toda la información del post
    let body = req.body
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        

        res.json({
            ok:true,
            usuario: usuarioDB
        })


    })
    
  })

  app.get('/usuario', function (req, res) {
    
    //desde que registro quiero
    let desde = req.query.desde || 0
    desde = Number(desde)

    //cuantos quiero por pagina
    let limite = req.query.limite || 5
    limite = Number(limite)
    Usuario.find({estado: true}, 'nombre email estado google role img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok:false,
                    err
                })
            }
            Usuario.count({estado: true}, (err, cantidadReg) => {
                res.json({
                    ok:true,
                    cantidadReg,
                    usuarios: usuarioDB
                })

            })
        })
  })

  //put
  //para actualizar registros

  app.put('/usuario/:id', function (req, res) {
      //id es porque asi es la variable que le definio en la url
      let id = req.params.id
      const fieldsPermit = ['nombre', 'email', 'img', 'role', 'estado']
      let body = _.pick(req.body, fieldsPermit )     
      Usuario.findByIdAndUpdate(id, body,{new: true, runValidators: true},(err, usuarioDB) => {


        if (err) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        })
      })

  
  })

  //BORRADO FISICO

//   app.delete('/usuario/:id', function (req, res) {
//     let id = req.params.id

//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

//         if (err) {
//             return res.status(400).json({
//                 ok:false,
//                 err
//             })
//         }

//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 ok:false,
//                 err:{
//                     message: 'Usuario no encontrado'
//                 }
//             })
//         }

//         res.json({
//             ok:true,
//             usuario: usuarioBorrado
//         })

//     })

//   })


  app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id

    let cambiaestado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaestado ,{new: true},(err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok:true,
            usuario: usuarioBorrado
        })

    })

})



  module.exports = app
