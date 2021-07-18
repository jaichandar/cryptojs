const express = require('express')
const app = express()
const mongoose = require('mongoose')

const register = require('./router/register')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
// app.use((req, res, next) => {
//     req.body.password
//     next()
// })

app.use('/', register)

app.get('/', (req, res) => {
    res.render('index')
})




mongoose.connect('mongodb://localhost:27017/form', {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('db connected'))
    .catch(err => console.log(err))


const Port = process.env.PORT || 3000
app.listen(Port, () => {
    console.log(`http://localhost:${Port}`)
})