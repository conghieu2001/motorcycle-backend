import mongoose, { Schema, mongo } from 'mongoose'

const productShema = new Schema({
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'brand',
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    name: {
      type: String,
      require: true  
    },
    color: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    inputQuantity: {
        type: Number,
        default: 0
    },
    salePrice: {
        type: Number,
        require: true,
        default: 0
    },
    saleQuantity: {
        type: Number,
        default: 0
    },
    warrantyTime: {
        type: Number,
        default: 0
    },
    inputPrice: {
        type: Number,
        default: 0
    },
    specs: [
        {
          klbt:{type:String},  
          drc:{type:String},  
          kctbx:{type:String},  
          dcy:{type:String},  
          ksgx:{type:String},  
          dtbx:{type:String}, 
          kclt:{type:String}, 
          pt:{type:String}, 
          ps:{type:String}, 
          ldc:{type:String}, 
          cstd:{type:String}, 
          dtnm:{type:String}, 
          mttnl:{type:String}, 
          ltd:{type:String}, 
          htkd:{type:String}, 
          mcd:{type:String}, 
          dtxl:{type:String}, 
          tsn:{type:String}, 
          dkhtpt:{type:String}, 
        },
        
    ]
}, {timestamps: true})

export default mongoose.model('product', productShema)