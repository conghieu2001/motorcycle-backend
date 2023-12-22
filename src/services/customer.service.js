import customerModel from "../models/customer.model";

class customerService {
    async create(data) {
        return await customerModel.create(data);
    }

    async findById(id) {
        return await customerModel
            .findById(id)
            .lean();
    }

    async getAll(condition, pageNumber, pageSize) {
        // co phan trang
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            // const sortCondition= sort ? sort: {createdAt:-1}
            return await customerModel
                .find(condition)
                .skip(skip)
                .limit(pageSize);
        }
        // khong phan trang && khong dung de find private key
        else {
            return await customerModel.find(condition);
        }
    }

    async update(id, data) {
        return await customerModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteRole(id) {
        return await customerModel.findByIdAndRemove(id);
    }
    async findByPhoneNumber(phoneNumber) {
        return await customerModel.findOne({phoneNumber})
    }
}

export default new customerService();
