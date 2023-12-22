import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const brandSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String,
        default: ''
    },
})

export default mongoose.model('provider', brandSchema);