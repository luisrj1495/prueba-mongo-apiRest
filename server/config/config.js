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

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30



// =====================
// Seed, semilla de autenticacion, o clave secreta
// =====================

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'codigo-secreto'

