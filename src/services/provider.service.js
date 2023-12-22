import providerModel from "../models/provider.model";
var ObjectId = require('mongodb').ObjectId;

class brandService {
    async create (data) {
        return await providerModel.create(data)
    }
    async getAll () {
        return await providerModel.find({})
    }
    // async update(id, data) {
    //     return await providerModel.findByIdAndUpdate(
    //         id, 
    //         {$set: data},
    //         { returnDocument: "after" }
    //     )
    // }
    // async delete (id) {
    //     return await providerModel.findByIdAndDelete(id)
    // }
    // async findByName (name) {
    //     return await providerModel.findOne({name})
    // }
    // async findById(id) {
    //     return await providerModel.findOne({
    //         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    //       })
    // } 
}

export default new brandService();