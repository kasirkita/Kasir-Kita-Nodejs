const mongoose = require('mongoose')
const schema = mongoose.Schema

const UserSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    role: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'role'
    }
},{
    timestamps: true
}
)

module.exports = User = mongoose.model('user', UserSchema)