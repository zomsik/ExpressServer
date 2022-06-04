const router = require("express").Router()
const { User } = require("../models/user")
const { getLogin } = require("../getLogin")
router.post("/", async (req, res) => {
    try {
        const login = getLogin(req.body.token)
        await User.deleteOne({ login: login })
        res.status(200).send({ message: "Usunięto konto!", status: 200 })
    
    } catch (error) {

        res.status(500).send({ message: "Wewnętrzny błąd serwera!" })
    }
})

module.exports = router