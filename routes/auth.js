const router = require("express").Router()
const { User } = require("../models/user")
const bcrypt = require("bcrypt")
const Joi = require("joi")

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        
        const user = await User.findOne({ login: req.body.login })
        
        if (!user)
            return res.status(401).send({ message: "Brak użytkownika o takim loginie!" })
        
        const validPassword = await bcrypt.compare(req.body.password,user.password)
        
        if (!validPassword)
            return res.status(401).send({ message: " Błędne hasło!" })

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Zalogowano!" })
        console.log('Zalogowano')

    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera!" })
    }
})

const validate = (data) => {
    const schema = Joi.object({
        login: Joi.string().required().label("Login"),
        password: Joi.string().required().label("Password"),
    })
    return schema.validate(data)
}
module.exports = router