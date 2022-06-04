const router = require("express").Router()
const { Chart } = require("../models/chart")
const { getLogin } = require("../getLogin")
router.post("/", async (req, res) => {

    try {
        const login = getLogin(req.body.token)
        const c = await Chart.findOne({ login: login, chartTitle: req.body.chartTitle })

        if (c)
            return res.status(409).send({ message: "Posiadasz już zapisany identyczny wykres!" })

            
        await new Chart({ ...req.body, login: login }).save()
        res.status(200).send({ message: "Zapisano wykres w ulubionych" })

    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera!" })
    }
})

module.exports = router