import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const bussinessSchema = new Schema({
    name: {
        type: String,
    },
    logo: {
        type: String,
        default: 'https://www.pinterest.com/pin/130885932912879185/'
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    mst: {
        type: String
    },
    ndd: {
        type: String
    },
    nameVT: {
        type: String
    },
    nameVT1: {type:String},
    nameVT2: {type:String},
    addressVT:{type:String},
    nameBank:{type:String}
})

export default mongoose.model('bussiness', bussinessSchema);