import departmentModel from '../models/department.model'

class departmentService{
    async create(data){
        return await departmentModel.create(data)
    }

    async getAll() {
        return await departmentModel.find({}).lean()
    }
    async findByName (name) {
        return await departmentModel.findOne({name})
    }
}

export default new departmentService()