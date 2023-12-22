import mongoose, {Schema} from "mongoose";

const priceAccessModel = new Schema ({
    accessory: {
        type: Schema.Types.ObjectId,
        ref: 'accessory'
    },
    nameMotocycle: {
        type: String,
        require: true
    },
    inputPrice: {
        type: Number,
        require: true,
    },
    salePrice: {
        type: Number,
        require: true
    }
})

export default mongoose.model('priceAccess', priceAccessModel)