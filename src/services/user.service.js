import userModel from "../models/user.model";

class UserService {
    async register(data) {
        return await userModel.create(data);
    }
    async findByEmail(email) {
        return await userModel.findOne({email}).lean()
    }
    async findById(id) {
        return await userModel.findById(id).lean()
    }
    async findByPhoneNumber(phoneNumber) {
        return await userModel.findOne({phoneNumber}).lean()
    }
    async isEmail( id, email ) {
        return await userModel.findOne({email: email, _id: {$ne:id}})
    }
    async isPhoneNumber( id, phoneNumber ) {
        return await userModel.findOne({phoneNumber: phoneNumber, _id:{$ne:id}})
    }
    async update(id, data) {
        return await userModel.findByIdAndUpdate(id, data, { returnDocument: "after", upsert: true}).lean()
    }
    async updateAvatar(id, data) {
        return await userModel.findByIdAndUpdate(id, data);
    }
    async getAll() {
        return await userModel.find().lean();
    }
    async findUser(condition, pageNumber, pageSize){
        // co phan trang
        if(!!pageNumber && !!pageSize){
            const skip= (pageNumber-1)*pageSize
            // const sortCondition= sort ? sort: {createdAt:-1}
            return await userModel.find(condition).skip(skip).limit(pageSize).lean()
        }
        // khong phan trang && khong dung de find private key
        else{
            return await userModel.find(condition).lean();
        }
    }
    async getStaff() {
        return await userModel.find({isStaff: true}).lean();
    }
    async updateRole(type, id, roleId) {
        if(type == 'addrole' ) {
            return await userModel.findByIdAndUpdate(
                id,
                {$addToSet: {roles: {roleId: roleId}}},
                {returnDocument: 'after', upsert: true}
            )
        }
        else if(type == 'removerole') {
            return await userModel.findByIdAndUpdate(
                id,
                {$pull: {roles: {roleId: roleId}}},
                {returnDocument: 'after', upsert: true}
            )
        }
    }
    
}

export default new UserService();