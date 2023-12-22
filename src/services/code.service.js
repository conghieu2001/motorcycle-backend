import codeModel from "../models/code.model";

class codeService{
    async create(data){
        return await codeModel.create(data)        
    }

    async findAllByEmail(emailUser){
        return await codeModel.find({
            emailUser,
            usedCodeReset:false,
            resetTokenExpires: { $gt: Date.now() }
        })
        .sort({ createdAt: -1 })
        .lean()
    }
    async findAllByEmailCreate(emailUser){
        // console.log(emailUser)
        return await codeModel.find({
            emailUser,       
            usedCodeCreate:false,
            resetTokenExpires: { $gt: Date.now() }
        })
        .sort({ createdAt: -1 })
        .lean()
    }

    async updateCodeUsed (email, code){
        return await codeModel.findOneAndUpdate({emailUser:email, codeNumber:code}, {usedCodeReset:true})
    }
    async updateCodeCreateUsed (email, code){
        return await codeModel.findOneAndUpdate({emailUser:email, codeNumber:code}, {usedCodeCreate:true})
    }
}
export default new codeService()