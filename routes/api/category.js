const express = require('express')
const Category = require('../../models/Category')
const router = express.Router()
const slugify = require('slugify')

router.get('/category', async (req, res) => {
    
    const ordering = JSON.parse(req.query.ordering)
    const perpage = parseInt(req.query.perpage)
    const page = parseInt(req.query.page)

    let query

    if (req.query.keyword || req.query.filter !== 'all') {
        query = {
            $and: [
                { $or: [ { name: { $regex: '.*' + req.query.keyword + '.*', $options: 'i' } }] },
                { $or: [ { isActive: req.query.filter === 'active' ? true : false } ] }
            ]
        }
    } else {
        query = {}
    }

    const categories = await Category
                        .find(query)
                        .limit(perpage)
                        .skip(perpage * (page - 1))
                        .sort({
                            [ordering.type]: ordering.sort
                        })
    
    const count = await Category.find(query).count()

    return res.json({
        data: categories,
        count
    })

})


router.post('/category', (req, res) => {
    Category.findOrCreate({slug: slugify(req.body.name, {lower: true})}, {
        name: req.body.name,
        slug: slugify(req.body.name, {lower: true})
    }).then(category => {
        return res.json({
            message: 'Data berhasil disimpan'
        })
    }).catch(err => {
        return res.json({
            message: err
        })
    })
})


router.get('/category/:id', (req, res) => {
    Category.findById(req.params.id).then(category => {
        return res.json({
            data: category
        })
    }).catch(err => {
        return res.status(500).json({
            message: err
        })
    })
})


router.post('/category/:id', (req, res) => {
    Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        slug: slugify(req.body.name, {lower: true})
    }).then(() => {
        return res.json({
            message: 'Data berhasil diubah'
        })
    }).catch(err => {
        return res.json({
            message: err
        })
    })
})


router.delete('/category/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(() => {
        return res.json({
            message: 'Data berhasil dihapus'
        })
    }).catch(err => {
        return res.status(500).json({
            message: err
        })
    })
})

router.post('/category/toggle/:id', (req, res) => {
    Category.findByIdAndUpdate(req.params.id, {
        isActive: req.body.is_active
    }).then(category => {
        return res.json({
            message: `Data ${!category.isActive ? 'Diaktifkan': 'Dinonaktifkan'}`
        })
    }).catch(err => {
        return res.status(500).json({
            message: err
        })
    })
})


module.exports = router