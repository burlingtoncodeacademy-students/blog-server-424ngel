require('dotenv').config()
const express = require('express')
const app = express()


const PORT = process.env.PORT
const routesController = require('./controllers/routes')

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//-----------------------------------------------
app.use(routesController)

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`)
})