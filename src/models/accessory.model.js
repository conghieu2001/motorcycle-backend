import mongoose, {Schema} from "mongoose";

const accessoryModel = new Schema({
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'brand'
    },
    name: {
        type: String,
        require: true  
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    inputQuantity: {
        type: Number,
        default: 0
    },
    inputPrice: {
        type: Number,
        default: 0
    },
    salePrice: {
        type: Number,
        default: 0
    },
    saleQuantity: {
        type: Number,
        default: 0
    },
    // warrantyTime: {
    //     type: Number,
    //     default: 0
    // },
    fitProductId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'product'
        }
    ]
}, {timestamps: true})

export default mongoose.model('accessory', accessoryModel)