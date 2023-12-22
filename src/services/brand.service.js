import brandModel from "../models/brand.model";
var ObjectId = require('mongodb').ObjectId;

class brandService {
    async create (data) {
        return await brandModel.create(data)
    }
    async getAll () {
        return await brandModel.find({})
    }
    async update(id, data) {
        return await brandModel.findByIdAndUpdate(
            id, 
            {$set: data},
            { returnDocument: "after" }
        )
    }
    async delete (id) {
        return await brandModel.findByIdAndDelete(id)
    }
    async findByName (name) {
        return await brandModel.findOne({name})
    }
    async findById(id) {
        return await brandModel.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
          })
    } 
}

export default new brandService();