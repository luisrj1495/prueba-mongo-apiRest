const express = require('express')
const fs = require('fs')
const path = require('path')

const { verificaTokenImg } = require('../middlewares/autenticacion')

const app = express()

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    const tipo = req.params.tipo
    const img = req.params.img
    const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`) 
    const pathNoImageFound = path.resolve(__dirname, '../assets/not-found.jpeg')

    fs.existsSync(pathImg) ? res.sendFile(pathImg) : res.sendFile(pathNoImageFound)
    
})



module.exports = app