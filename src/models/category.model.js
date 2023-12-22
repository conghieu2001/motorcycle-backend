import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        require: true
    }
})
export default mongoose.model('category', categorySchema);