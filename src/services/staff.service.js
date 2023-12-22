import staffModel from "../models/staff.model";

class staffService {
    async create(data) {
        return await staffModel.create(data);
    }

    async findById(id) {
        return await staffModel
            .findById(id)
            .populate("userId")
            .populate("departmentId")
            .lean();
    }

    async getAll(condition, pageNumber, pageSize) {
        // co phan trang
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            // const sortCondition= sort ? sort: {createdAt:-1}
            return await staffModel
                .find(condition)
                .populate("userId")
                .populate("departmentId")
                .skip(skip)
                .limit(pageSize);
        }
        // khong phan trang && khong dung de find private key
        else {
            return await staffModel.find(condition);
        }
    }

    async update(id, data) {
        return await staffModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteRole(id) {
        return await staffModel.findByIdAndRemove(id);
    }
}

export default new staffService();
