const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


// el enum valida que los roles perimitidos solo sean los que estan en rolesValidos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
}

let Schema = mongoose.Schema

let usuarioSchema = new Schema({
    nombre: {
        type:String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type:String,
        required: [true, 'El email es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img:{
        type:String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type:Boolean,
        default: false

    }
})

usuarioSchema.methods.toJSON = function(){
    let user = this
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único'})


module.exports = mongoose.model('Usuario', usuarioSchema)