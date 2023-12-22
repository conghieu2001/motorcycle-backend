import mongoose  from "mongoose";
import { Schema } from "mongoose";

const orderRepairSchema = new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'customer'
    },
    userId: {
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    staffId: {
      type:Schema.Types.ObjectId,
        ref:'staff'
    },
    products: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'accessory'
          },
          inputPrice: {
            type: Number,
            require: true,
          },
          salePrice: {
            type: Number,
            require: true,
          },
          saleQuantity: {
            type: Number,
            require: true,
          },
        },
      ],
    totalBill:Number,
    methodPay: {
        type: String
    },
    status:{
        type:String,
        enum:['Chờ thanh toán', 'Đã thanh toán', 'Đã hủy', 'Hoàn thành']
    },
    wage: {
      type: Number,
      default: 0
    },
    notes: {
        type: String
    },
    phoneNumber: {
      type: String
    },
    address: {
      type: String,
      default: ''
    },
},{timestamps:true})

export default mongoose.model('orderrepair', orderRepairSchema)