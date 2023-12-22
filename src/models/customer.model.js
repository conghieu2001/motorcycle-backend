import mongoose  from "mongoose";
import { Schema } from "mongoose";

const customerSchema = new Schema({
    name: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    
}, {timestamps:true})
export default mongoose.model('customer', customerSchema)