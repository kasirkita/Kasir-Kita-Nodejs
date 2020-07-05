const express = require('express')
const router = express.Router()
var Storage = require('node-storage');
const mongoose = require('mongoose');
const store = new Storage('../../config/database')
const validateConfiguration = require('../../validation/configure');

router.get('/configuration', (req, res) => {
    
    const isExists = store.get('database')

    if (isExists) {
        res.json({status: true, data: store.get('database')})
    } else {
        res.status(422).json({status: false})
    }

})

router.post('/configuration', (req, res) => {

    const {errors, isValid} = validateConfiguration(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    let mongodbConnect

    if (req.body.username === '' || req.body.password === '') {

        mongodbConnect = mongoose.connect(`mongodb://${req.body.host}:${req.body.port}/kasirkita`, {useNewUrlParser: true})

    } else {

        mongodbConnect = mongoose.connect(`mongodb://${req.body.username}:${req.body.password}@${req.body.host}:${req.body.port}/kasirkita?authSource=admin`, {useNewUrlParser: true})
    }

    mongodbConnect.then(() => {

        store.put('database', {
            username: req.body.username,
            password: req.body.password,
            host: req.body.host,
            port: req.body.port
        })

        res.json({
            message: 'Koneksi berhasil tersambung'
        })

    }).catch((err) => {

        res.status(500).json({
            message: 'Koneksi gagal'
        })
    
    })

})

module.exports = router