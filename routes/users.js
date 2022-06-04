const router = require("express").Router()
const { User, validate } = require("../models/user")
const bcrypt = require("bcrypt")

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) {
            switch (error.details[0].type) {
                case 'passwordComplexity.tooShort': return res.status(400).send({ message: "Hasło powinno mieć minimum 8 znakow" })
                case 'passwordComplexity.tooLong': return res.status(400).send({ message: "Hasło powinno mieć maksimum 26 znakow" })
                case 'passwordComplexity.lowercase': return res.status(400).send({ message: "Hasło powinno mieć minimum 1 mały znak" })
                case 'passwordComplexity.uppercase': return res.status(400).send({ message: "Hasło powinno mieć minimum 1 duży znak" })
                case 'passwordComplexity.numeric': return res.status(400).send({ message: "Hasło powinno mieć minimum 1 cyfrę" })
                case 'passwordComplexity.symbol': return res.status(400).send({ message: "Hasło powinno mieć minimum 1 symbol" })
                case 'passwordComplexity.requirementCount': return res.status(400).send({ message: "Hasło musi spełniać minimum 4 różne wymagania" })
            }
        }
        
        const user1 = await User.findOne({ login: req.body.login })

        if (user1)
            return res.status(409).send({ message: "Użytkownik o takim loginie istnieje!" })

        const user2 = await User.findOne({ email: req.body.email })
        
        if (user2)
            return res.status(409).send({ message: "Użytkownik o takim emailu istnieje!" })



            const salt = await bcrypt.genSalt(Number(process.env.SALT))
            const hashPassword = await bcrypt.hash(req.body.password, salt)

            await new User({ ...req.body, password: hashPassword }).save()
            res.status(200).send({ message: "Utworzono użytkownika" })

    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
})
module.exports = router