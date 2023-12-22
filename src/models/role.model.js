import mongoose from 'mongoose';
const { Schema } = mongoose;

const roleSchema = new Schema({
    name: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('role', roleSchema);