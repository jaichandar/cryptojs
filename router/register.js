const express = require('express')
const router = express.Router()
const { Register } = require('../models/Register')
const { DecryPt, EncryPt } = require('../crypto')
const config = require('config')
const { check, validationResult } = require('express-validator')

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/', async (req, res) => {
    const register = await Register.find()
    res.send(register)
})

router.post('/register', [
    check('username', 'please enter the valid username')
        .exists()
        .isLength({ min: 3 }),
    check('email', 'please enter the valid email')
        .exists()
        .isEmail()
        .normalizeEmail(),
    check('password', 'please enter the valid password')
        .isLength({ min: 5 }),
    check('password1', 'please re-enter the password')
        .isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send(errors.array())
    }
    const encrypt = EncryPt(req.body.password, config.get('message'))
    let register = await Register({
        username: req.body.username,
        email: req.body.email,
        password: encrypt,
        password1: req.body.passsword1
    })
    register = await register.save()
    res.render('login', {
        data: {
            register
        }
    })
})


router.get('/login', (req, res) => {
    res.render('login')
})


router.post('/login', [
    check('email', 'please enter the valid email')
        .isEmail(),
    check('password', 'please enter the valid password')
        .isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send(errors.array())
    }
    let user = await Register.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).send('invalid email/password')
    }
    let comparePassword = await Register.findOne({ email: req.body.email })

    const decrypt = DecryPt(comparePassword.password, config.get('message'))
    if (decrypt !== req.body.password) {
        return res.status(404).send('invalid email/password')
    }
    res.render('dashboard')
})

module.exports = router

