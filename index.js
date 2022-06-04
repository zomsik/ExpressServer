require('dotenv').config()


const express = require('express')
const app = express()
const cors = require('cors')
const connection = require('./db')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const deleteAccountRoutes = require("./routes/deleteAccount")
const changePasswordRoutes = require("./routes/changePassword")
const saveChartRoutes = require("./routes/saveChart")
const loadChartsRoutes = require("./routes/loadCharts")
const deleteChartRoutes = require("./routes/deleteChart")
const deleteAllChartsRoutes = require("./routes/deleteAllCharts")



connection()
app.use(express.json())
app.use(cors())

// routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/deleteAccount", deleteAccountRoutes)
app.use("/api/changePassword", changePasswordRoutes)
app.use("/api/saveChart", saveChartRoutes)
app.use("/api/loadCharts", loadChartsRoutes)
app.use("/api/deleteChart", deleteChartRoutes)
app.use("/api/deleteAllCharts", deleteAllChartsRoutes)

const port = process.env.PORT || 9000
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))