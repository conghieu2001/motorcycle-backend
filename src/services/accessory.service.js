import accessoryModel from "../models/accessory.model";

class accessoryService {
    async create (data) {
        return await accessoryModel.create(data)
    }
    async getAll(condition, pageNumber, pageSize) {
        if(!!pageNumber && !!pageSize){
            const skip= (pageNumber-1)*pageSize
            return await accessoryModel.find(condition).populate("fitProductId").skip(skip).limit(pageSize).lean()
        }
        else{
            return await accessoryModel.find(condition).populate("fitProductId").lean()
        }
    }
    async update(id, data) {
        return await accessoryModel.findByIdAndUpdate(id, {$set: data}, {returnDocument: 'after'})
    }
    async delete(id) {
        return await accessoryModel.findByIdAndDelete(id)
    }
    async findById(id) {
        return await accessoryModel.findById(id).populate("fitProductId")
    }
    async findByIdUpdate(id) {
        return await accessoryModel.findById(id)
    }
    async findByName(name) {
        return await accessoryModel.find({
          name: { $regex: new RegExp(name), $options: "i" },
        });
    }
    async findByIdAndUpdate(id, data) {
        return await accessoryModel.findByIdAndUpdate(id, {$inc:{inputQuantity: data.inputQuantity},
            $set:{inputPrice:data.inputPrice}}, {returnDocument: 'after'}).lean()
    }
    async updateSaleQuantity(id, data) {
        return await accessoryModel.findByIdAndUpdate(id, {$inc:{saleQuantity: data.saleQuantity, inputQuantity: -data.saleQuantity}}, {returnDocument: 'after'}).lean()
    }
    async cancelOrder(id, data) {
        return await accessoryModel.findByIdAndUpdate(id, {$inc:{inputQuantity: data.saleQuantity, saleQuantity: -data.saleQuantity}}, {returnDocument: 'after'}).lean()
    }
    async getByQuantity() {
        return await accessoryModel.find({inputQuantity: {$gt: 0}}).lean()
    }
    
}

export default new accessoryService()