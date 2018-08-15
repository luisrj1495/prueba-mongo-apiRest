const express = require('express')

const { verificaToken, verificaRole } = require('../middlewares/autenticacion')

const app = express()

const Categoria = require('../models/categoria')


app.get('/categoria', [verificaToken], (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: err
                    }
                })
            }

            return res.json({
                ok: true,
                categorias: categoriasDB
            })

        })
})


//mostrar una categoria por id

app.get('/categoria/:id', [verificaToken], (req, res) => {

    const id = req.params.id
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: ' Error :('
                }
            })
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})


// crear nueva categoria
// req.usuario._id

app.post('/categoria', [verificaToken], (req, res) => {
    const body = req.body
    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: err
                }
            })
        }


        return res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})


// editar categoria

app.put('/categoria/:id', [verificaToken], (req, res) => {

    const id = req.params.id
    const body = req.body

    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: err
                }
            })
        }


        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

// eliminar
// solo el admin puede eliminar

app.delete('/categoria/:id', [ verificaToken, verificaRole ],(req, res) => {
    const id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: err
                }
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
})



module.exports = app



