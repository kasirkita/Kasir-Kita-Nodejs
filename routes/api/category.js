const express = require('express')
const Category = require('../../models/Category')
const router = express.Router()
const slugify = require('slugify')

router.get('/category', async (req, res) => {
    
    const ordering = JSON.parse(req.query.ordering)
    const perpage = parseInt(req.query.perpage)
    const page = parseInt(req.query.page)

    let query

    if (req.query.keyword) {
        query = {
            $or: [
                { name: { $regex: '.*' + req.query.keyword + '.*', $options: 'i' } }
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

module.exports = router