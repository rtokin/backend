const express = require('express')
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const { Pool } = require('pg')
const app = express()
const authRouter = require('./authRouter')

app.use(express.json())
app.use("/auth", authRouter)

// Конфигурация PostgreSQL
const pgPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1',
  port: 5432,
})

// Обработчики событий для MongoDB
mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB...')
})

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected ✅')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

const start = async () => {
  try {
    // Подключаем MongoDB
    await mongoose.connect(
      'mongodb+srv://etosdelaljamal:USER12@cluster0.su2jq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      {
        serverSelectionTimeoutMS: 5000, // Таймаут 5 секунд
      }
    )
    
    // Проверяем подключение к PostgreSQL
    const pgResult = await pgPool.query('SELECT NOW()')
    console.log('PostgreSQL connected ✅', pgResult.rows[0].now)
    
    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} ✅`)
      console.log('Available routes:')
      console.log(`- POST http://localhost:${PORT}/auth/register`)
      console.log(`- POST http://localhost:${PORT}/auth/login`)
    })
    
  } catch(e) {
    console.error("\nStartup error:", e.message)
    console.log("\nTroubleshooting tips:")
    
    if (e.name === 'MongoServerSelectionError') {
      console.log('- Check your MongoDB connection string')
      console.log('- Verify internet connection (for MongoDB Atlas)')
      console.log('- Check if MongoDB service is running')
    }
    
    if (e.message.includes('password authentication failed')) {
      console.log('- Check PostgreSQL username/password')
      console.log('- Verify PostgreSQL service is running')
      console.log('- Check pg_hba.conf configuration')
    }
    
    process.exit(1) // Завершаем процесс с ошибкой
  }
}

start()

// Экспортируем pool для использования в других файлах
module.exports = {
  pgPool,
  mongoose
}