import mongoose from 'mongoose';
const { Schema } = mongoose;

const staffSchema = new Schema({
    // fullName: {
    //     type: String
    // },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    birthday: {
        type: Date
    },
    gender:{
        type:String,
        emun:['Nam', 'Nu']
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    position: {
        type: String
    },
    academic: {
        type: String
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'department'
    },
    dateOfJoin:{
        type:Date,
    },
    probationaryDate: {
        type: Date
    } ,
    officialDate: {
        type: Date
    },
    personalEmail: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('staff', staffSchema);