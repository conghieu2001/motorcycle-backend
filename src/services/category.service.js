import categoryModel from "../models/category.model";
var ObjectId = require('mongodb').ObjectId;

class categoryService {
    async create (data) {
        return await categoryModel.create(data)
    }
    async getAll () {
        return await categoryModel.find({})
    }
    async delete (id) {
        return await categoryModel.findByIdAndDelete(id)
    }
    async findByName (name) {
        return await categoryModel.findOne({name: name})
    }
    async findById(id) {
        return await categoryModel.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
          })
    } 
}

export default new categoryService();