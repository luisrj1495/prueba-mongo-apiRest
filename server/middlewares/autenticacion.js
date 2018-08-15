

const jwt = require('jsonwebtoken')

// ======================
// Verificar token
// ======================

const verificaToken = (req, res, next) => {
    //Obtinen los valores del header
    let token = req.get('token')

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.Usuario
        next()
    })
}

// ======================
// Verificar token img
// ======================
const verificaTokenImg = (req, res, next) => {
    //Obtinen los valores del header
    let token = req.query.token

     jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
       if(err){
           return res.status(401).json({
               ok:false,
               err: {
                   message: 'Token no valido'
               }
           })
       }
       req.usuario = decoded.Usuario
        next()
     })
}

// ======================
// Verificar admin role
// ======================
  
const verificaRole = (req, res, next) => {
    //Obtinen los valores del header
    let usuario = req.usuario 
    console.log(usuario);
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok:false,
            err: {
                message: 'Usuario no valido'
            }
        })
    }
    next()
}



module.exports = {
    verificaToken,
    verificaRole,
    verificaTokenImg
}