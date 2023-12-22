import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const brandSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    logo: {
        type: String
    }
})

export default mongoose.model('brand', brandSchema);