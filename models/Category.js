const mongoose = require('mongoose')
const schema = mongoose.Schema
const findOrCreate = require('mongoose-findorcreate')

const CategorySchema = new schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

CategorySchema.plugin(findOrCreate)

module.exports = Category = mongoose.model('category', CategorySchema)