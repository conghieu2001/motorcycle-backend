import roleModel from '../models/role.model'

class roleService{
    async create(data){
        return await roleModel.create(data)
    }

    async findById(id){
        return await roleModel.findById(id).lean()
    }

    async getAll(condition, pageNumber, pageSize) {
        // co phan trang
        if (!!pageNumber && !!pageSize) {
          const skip = (pageNumber - 1) * pageSize;
          // const sortCondition= sort ? sort: {createdAt:-1}
          return await roleModel
            .find(condition)
            .skip(skip)
            .limit(pageSize);
        }
        // khong phan trang && khong dung de find private key
        else {
          return await roleModel
            .find(condition)
        }
      }

    async updateRole(id, name){
        return await roleModel.findByIdAndUpdate(id,name,{new:true})
    }
    
    async deleteRole(id){
        return await roleModel.findByIdAndRemove(id)
    }
}

export default new roleService()