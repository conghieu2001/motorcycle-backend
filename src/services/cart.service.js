import cartModel from "../models/cart.model";

class cartService {
    async create(data) {
        return await cartModel.create(data)
    }
    async getAll(condition, pageNumber, pageSize) {
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize
            return await cartModel.find(condition)
                        .populate("products.productId")
                        .populate("userId")
                        .skip(skip).limit(pageSize).lean()
        }
        else {
            return await cartModel.find(condition)
                        .populate('products.productId')
                        .populate("userId").lean()
        }
    }
    async update(id, data) {
        return await cartModel.findByIdAndUpdate(id, { $set: data }, { returnDocument: 'after' })
    }
    async delete(id) {
        return await cartModel.findByIdAndDelete(id)
    }
    async findById(id) {
        return await cartModel.findById(id).populate("products.productId").populate("userId").lean()
    }


}

export default new cartService()