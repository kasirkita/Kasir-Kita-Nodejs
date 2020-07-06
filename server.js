const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const db = require('./config/Keys').mongoURI
const app = express()
const users = require('./routes/api/users')
const configuration = require('./routes/api/configuration')
const category = require('./routes/api/category')
var cors = require('cors');
// const path = require('path')

mongoose.connect(db, {useNewUrlParser: true}).then(() => {
        console.log(`Mongodb Connected`)
}).catch(err => {
        console.log(err)
})

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))
app.use('/api', users)
app.use('/api', configuration)
app.use('/api', category)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))