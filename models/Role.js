const mongoose = require('mongoose')
const schema = mongoose.Schema

const RoleSchema = new schema({

    name: {
        type: String,
        required: true
    },
    permissions: {
        type: Array,
        required: true,
        ref: 'permissions.permission'
    },
    user: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ]
})

module.exports = Role = mongoose.model('role', RoleSchema)