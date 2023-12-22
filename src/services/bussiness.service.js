import bussinessModel from "../models/bussiness.model";


class bussinessService {
    async create (data) {
        return await bussinessModel.create(data)
    }
    async getAll () {
        return await bussinessModel.findById("654b33b00dafb387913b0289").lean()
    }
    async update(id, data) {
        return await bussinessModel.findByIdAndUpdate(id, data, { returnDocument: "after", upsert: true}).lean();
    }
     
}

export default new bussinessService();