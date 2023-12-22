import mongoose, { mongo } from "mongoose";

import { Schema } from "mongoose";

const userShema = new Schema({
    fullName: {
        type: String
    },
    email: {
        type: String,
        require: true,
        minlength: 10,
        maxlength: 50,
    },
    password: {
        type: String,
        require: true,
        minlength: 8
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isStaff: {
        type: Boolean,
        default: false
    },
    isGoogle: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: 'default-avt.jpg'
    },
    roles: [{
        roleId: {
            type: Schema.Types.ObjectId,
            ref: 'role',
        }
    }],
    phoneNumber: {
        type:String,
        default: 'bổ sung'
    },
    locked: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export default mongoose.model('user', userShema)