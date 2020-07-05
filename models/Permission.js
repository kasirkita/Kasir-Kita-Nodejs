const mongoose = require('mongoose')
const schema = mongoose.Schema

const PermissionSchema = new schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    slug: {
        type: String
    },
    parent: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'permission'
    }
})

module.exports = Permission = mongoose.model('permission', PermissionSchema)