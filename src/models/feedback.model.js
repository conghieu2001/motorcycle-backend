import mongoose, {Schema} from "mongoose";

const feedbackModel = new Schema({
    item: 
    {
        productType: {
        type: String,
        default: 'product',
        enum: ['product', 'accessory']
        },
        productId: {
        type: Schema.Types.ObjectId,
        refPath: 'item.productType'
        },
    },
    comment: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    star: {
        type: Number,
        default: 5
    },
    orderId: {
        type: Schema.Types.ObjectId,
        // ref: 'order'
    },
    locked: {
        type: Boolean,
        default: false
    }
    
}, {timestamps: true})

export default mongoose.model('feedback', feedbackModel)