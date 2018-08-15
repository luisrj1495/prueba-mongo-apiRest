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
    process.env.MONGO_MLAB_URL


process.env.URLDB = urlDB

// =====================
// Fecha de expiracion del token
// =====================
// 60 segundos
// 60 minutos
// 24 horas 
// 30 dias

process.env.CADUCIDAD_TOKEN = '48h'



// =====================
// Seed, semilla de autenticacion, o clave secreta
// =====================

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'codigo-secreto'


// =====================
// Google client
// =====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '562999825128-ffc0tqq48gv6q7n1o3efo8iv9lnm08ju.apps.googleusercontent.com'