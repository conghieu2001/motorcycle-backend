import productModel from "../models/product.model";

class productService {
    async create(data) {
        return await productModel.create(data)
    }
    async getAll() {
        return await productModel.find({}).lean()
    }
    async update(id, data) {
        return await productModel.findByIdAndUpdate(id, {$set: data}, {returnDocument: 'after'}).lean()
    }
    async delete(id) {
        return await productModel.findByIdAndDelete(id)
    }
    async findById(id) {
        return await productModel.findById(id).lean()
    }
    async findByIdAndUpdate(id, data) {
        return await productModel.findByIdAndUpdate(id, {$inc:{inputQuantity: data.inputQuantity},
            $set:{inputPrice:data.inputPrice}}, {returnDocument: 'after'}).lean()
    }
    async updateSaleQuantity(id, data) {
        return await productModel.findByIdAndUpdate(id, {$inc:{saleQuantity: data.saleQuantity, inputQuantity: -data.saleQuantity}}, {returnDocument: 'after'}).lean()
    }
    async cancelOrder(id, data) {
        return await productModel.findByIdAndUpdate(id, {$inc:{inputQuantity: data.saleQuantity, saleQuantity: -data.saleQuantity}}, {returnDocument: 'after'}).lean()
    }
    async findProduct(condition, pageNumber, pageSize){
        // co phan trang
        if(!!pageNumber && !!pageSize){
            const skip= (pageNumber-1)*pageSize
            // const sortCondition= sort ? sort: {createdAt:-1}
            return await productModel.find(condition).skip(skip).limit(pageSize).lean()
        }
        // khong phan trang && khong dung de find private key
        else{
            return await productModel.find(condition).lean()
        }
    }
    async findByCategoryId(id) {
        return await productModel.find({category: id})
    }
    async findByName(name) {
        return await productModel.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }
    async findByIdExportPdf(id) {
        return await productModel
            .findById(id)
            .populate('brandId', ['_id', 'name'])
            .populate('category', ['_id', 'name'])
    }
    async getByQuantity() {
        return await productModel.find({inputQuantity: {$gt: 0}}).lean()
    }
}
export default new productService()