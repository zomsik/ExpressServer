const router = require("express").Router()
const { User } = require("../models/user")
const { getLogin } = require("../getLogin")
const bcrypt = require("bcrypt")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")

router.post("/", async (req, res) => {
    try {


        const { error } = validate(req.body);
        const login = getLogin(req.body.token);

        const user = await User.findOne({ login: login })

        if (!user)
            return res.status(401).send({ message: "Sesja wygasła" })
            
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        
        if (!validPassword)
            return res.status(401).send({ message: "Masz inne hasło!" })

        if (error)
            {
                switch (error.details[0].type) {
                    case 'passwordComplexity.tooShort': return res.status(400).send({ message: "Nowe hasło powinno mieć minimum 8 znakow" })
                    case 'passwordComplexity.tooLong': return res.status(400).send({ message: "Nowe hasło powinno mieć maksimum 26 znakow" })
                    case 'passwordComplexity.lowercase': return res.status(400).send({ message: "Nowe hasło powinno mieć minimum 1 mały znak" })
                    case 'passwordComplexity.uppercase': return res.status(400).send({ message: "Nowe hasło powinno mieć minimum 1 duży znak" })
                    case 'passwordComplexity.numeric': return res.status(400).send({ message: "Nowe hasło powinno mieć minimum 1 cyfrę" })
                    case 'passwordComplexity.symbol': return res.status(400).send({ message: "Nowe hasło powinno mieć minimum 1 symbol" })
                    case 'passwordComplexity.requirementCount': return res.status(400).send({ message: "Nowe hasło musi spełniać minimum 4 różne wymagania" })
                }

                return res.status(400).send({ message: error.details[0].message })
            }


        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.newPassword, salt)

        let change = await User.findOneAndUpdate({ login: login }, { password: hashPassword });
        res.status(200).send({ message: "Zmieniono hasło!", status: 200 })

    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera!" })
    }
})

const validate = (data) => {
    const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().required().label("Password"),
        newPassword: passwordComplexity().required().label("Password"),
    })
    return schema.validate(data)
}
module.exports = router