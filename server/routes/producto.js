const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

const app = express()

const Producto = require('../models/producto')

//obtener todos los productos
//paginados
//con populate usuario y categoria


app.get('/productos',verificaToken, (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)

    Producto.find({disponible: true})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: err
                    }
                })
            }

            return res.json({
                ok:true,
                productos
            })

        })
})

// BUscar productos

app.get('/productos/buscar/:termino',verificaToken, (req, res) => {

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: err
                    }
                })
            }

        })

})


app.get('/productos/:id',verificaToken, (req, res) => {
    const id = req.params.id
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: err
                    }
                })
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Id no existe'
                    }
                })
            }

            return res.json({
                ok:true,
                producto: productoDB
            })

        })
})

app.post('/productos',verificaToken, (req, res) => {
    const body = req.body
    const producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    }) 

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: err
                }
            })
        }

       return res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

})

app.put('/productos/:id', verificaToken, (req, res) => {
    const body = req.body
    const id = req.params.id

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: err
                }
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el id'
                }
            })
        }


        productoDB.nombre = body.nombre,
        productoDB.precioUni = body.precioUni,
        productoDB.descripcion = body.descripcion,
        productoDB.disponible = body.disponible,
        productoDB.categoria = body.categoria

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: err
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })
        })


    })
})


app.delete('/productos/:id', (req, res) => {
    const id = req.params.id

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: err
                }
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el id'
                }
            })
        }



        productoDB.disponible = false,
    

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: err
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: ' Producto borrado :)'
            })
        })


    })
})

// eliminar 
//por disponible


module.exports = app