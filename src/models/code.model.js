import mongoose from "mongoose";
import { Schema } from "mongoose";

const codeSchema = new Schema({
    codeNumber: {
        type: String,
        required: true
    },
    emailUser:{
        type:String, 
    },
    resetTokenExpires:{
        type:Date
    },
    usedCodeReset:{
        type:Boolean,
        default:false
    },
    usedCodeCreate: {
        type:Boolean,
        default:false
    }
}, {timestamps:true})

export default mongoose.model('code', codeSchema);