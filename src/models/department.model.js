import mongoose from 'mongoose';
const { Schema } = mongoose;

const departmentSchema = new Schema({
    name: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('department', departmentSchema);