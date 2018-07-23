const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const app = express()

app.post('/login', (req, res) => {
  let body = req.body

  Usuario.findOne({email: body.email}, (err, UsuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if (!UsuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña incorrectos'
        }
      })
    }

    if (!bcrypt.compareSync(body.password, UsuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrectos'
        }
      })
    }

    let token = jwt.sign({
      Usuario: UsuarioDB
    }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN })

    res.json({
      ok: true,
      Usuario: UsuarioDB,
      token
    })
  })
})

// es para poder utilizar todas las configuraciones que hagamos de app en otras paginas
module.exports = app
