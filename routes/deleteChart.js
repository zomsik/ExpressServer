const router = require("express").Router()
const { Chart } = require("../models/chart")
const { getLogin } = require("../getLogin")
router.post("/", async (req, res) => {
    try {
        const login = getLogin(req.body.token)
        await Chart.deleteOne({ login: login, chartTitle: req.body.chartTitle })
        res.status(200).send({ message: "Usunięto wykres!" })
    
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera!" })
    }
})

module.exports = router