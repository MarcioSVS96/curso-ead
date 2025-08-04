const mysql = require("mysql2/promise")
require("dotenv").config()

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // XAMPP padrão não tem senha
  database: process.env.DB_NAME || "online_courses",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
}

const pool = mysql.createPool(dbConfig)

// Teste de conexão
const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log("✅ Conectado ao banco de dados MySQL (XAMPP)")
    console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`)
    console.log(`🗄️  Database: ${dbConfig.database}`)
    connection.release()
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error.message)
    console.log("💡 Verifique se o XAMPP está rodando e o MySQL está ativo")
    process.exit(1)
  }
}

module.exports = { pool, testConnection }
