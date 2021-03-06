require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// ejecute las rutas que creamos
// configuracion global de rutas
app.use(require('./routes'))

// app.get('/', function (req, res) {
// })

// habilitar public carpeta

app.use(express.static(path.resolve(__dirname, '../public')))

mongoose.connect(process.env.URLDB, (err, res) => {
  if (err) {
    throw err
  }

  console.log('Base de datos On line')
})

app.listen(process.env.PORT, () => {
  console.log('Escuchando por puerto 3000')
})
