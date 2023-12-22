import feedbackModel from "../models/feedback.model";

class feedbackService {
    async create (data) {
        return await feedbackModel.create(data)
    }
    async getAll(condition, pageNumber, pageSize) {
        if(!!pageNumber && !!pageSize){
            const skip= (pageNumber-1)*pageSize
            return await feedbackModel.find(condition).populate("item.productId").populate("userId").skip(skip).limit(pageSize).lean()
        }
        else{
            return await feedbackModel.find(condition).populate("item.productId").populate("userId").lean()
        }
    }
    async update(id, data) {
        return await feedbackModel.findByIdAndUpdate(id, {$set: data}, {returnDocument: 'after'})
    }
    async delete(id) {
        return await feedbackModel.findByIdAndDelete(id)
    }
    async findById(id) {
        return await feedbackModel.findById(id).populate("item.productId").populate("userId")
    }
}

export default new feedbackService()