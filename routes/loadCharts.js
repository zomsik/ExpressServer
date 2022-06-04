const router = require("express").Router()
const { Chart } = require("../models/chart")
const { getLogin } = require("../getLogin")
router.post("/", async (req, res) => {
    try {
        const login = getLogin(req.body.token)
        const charts = await Chart.find({ login: login })
        res.status(200).send({ data: charts, message: "Wczytano wykresy!" })
    
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera!" })
    }
})

module.exports = router