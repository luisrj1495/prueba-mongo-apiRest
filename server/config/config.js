//======================
// Puerto
//======================

process.env.PORT = process.env.PORT || 3000

// =====================
// Entorno
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// =====================
// Base de datos
// =====================

const urlDB = process.env.NODE_ENV === 'dev' ? 
    'mongodb://localhost:27017/cafedb' :
    'mongodb://cafe-user:cafeuser1495@ds045011.mlab.com:45011/cafedatabase'


process.env.URLDB = urlDB

