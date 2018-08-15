const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)

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

// CONFIGURACIONES DE GOOGLE

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  
  });
  const payload = ticket.getPayload();
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

app.post('/google', async (req, res) => {
  const token = req.body.idtoken
  
  const googleUser = await verify(token)
                      .catch(err => { 
                        res.status(403).json({
                          ok: false,
                          err
                        })
                      })

  Usuario.findOne({ email: googleUser.email }, (err, UsuarioDB)=> {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (UsuarioDB) {
      if (!UsuarioDB.google) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe de usar su atenticación normal'
          }
        })
      } else {
        const token = jwt.sign({
          usuario: UsuarioDB
        }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN})

        return res.json({
          ok:true,
          usuario: UsuarioDB,
          token
        })
      }
    } else {
      //si el usuario no existe en la base de datos

      const usuario = new Usuario()

      usuario.nombre = googleUser.nombre
      usuario.email = googleUser.email
      usuario.img = googleUser.img
      usuario.google = true
      usuario.password = ':)'

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          })
        }

        const token = jwt.sign({
          usuario: UsuarioDB
        }, process.env.SEED_TOKEN, {expiresIn: process.env.CADUCIDAD_TOKEN})

        return res.json({
          ok:true,
          usuario: UsuarioDB,
          token
        })

      })

    }

  })


})

// es para poder utilizar todas las configuraciones que hagamos de app en otras paginas
module.exports = app
