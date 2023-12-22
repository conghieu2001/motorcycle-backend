import mongoose, {Schema} from "mongoose";

const cartModel = new Schema({
    products: [
        {   
            productType: {
              type: String,
              default: 'product',
              enum: ['product', 'accessory']
            },
            productId: {
              type: Schema.Types.ObjectId,
              refPath: 'products.productType'
            },
            quantity: {type: Number}
        },
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {timestamps: true})

export default mongoose.model('cart', cartModel)