import mongoose  from "mongoose";
import { Schema } from "mongoose";

const orderSchema = new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'customer'
    },
    userId: {
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    // staffId:{
    //     type:Schema.Types.ObjectId,
    //     ref:'staff'
    // },
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
        default: 'Chờ xử lý',
        enum:['Chờ thanh toán', 'Đã thanh toán', 'Đã hủy', 'Đã đặt hàng', 'Hoàn thành']
    },
    notes: {
        type: String
    }, 
    name: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    address: {
      type: String,
      default: ''
    },
    amountPaid: {
      type: Number,
      default: 0
    }
},{timestamps:true})

export default mongoose.model('order', orderSchema)