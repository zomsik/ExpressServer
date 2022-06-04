const router = require("express").Router()
const { Chart } = require("../models/chart")
const { getLogin } = require("../getLogin")

router.post("/", async (req, res) => {
    try {
        const login = getLogin(req.body.token)
        const numberOfDeleted = await Chart.deleteMany({ login: login })
        res.status(200).send({ data: numberOfDeleted, message: "Usunięto wszystkie wykresy!", status: 200 })
    
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera!" })
    }
})

module.exports = router