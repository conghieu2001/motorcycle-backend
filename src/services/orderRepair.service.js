import orderRepairModel from "../models/orderRepair.model";

class orderRepairService {
    async create(data) {
        return await orderRepairModel.create(data);
    }

    async findById(id) {
        return await orderRepairModel
            .findById(id)
            .populate('staffId')
            .populate('customerId')
            .populate('products.productId')
            .populate('userId')
            .lean();
    }

    async getAll(condition, pageNumber, pageSize) {
        // co phan trang
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            // const sortCondition= sort ? sort: {createdAt:-1}
            return await orderRepairModel
                .find(condition)
                .populate('staffId')
                .populate('customerId')
                .populate('products.productId')
                .populate('userId')
                .skip(skip)
                .limit(pageSize);
        }
        // khong phan trang && khong dung de find private key
        else {
            return await orderRepairModel.find(condition)
                        .populate('staffId')
                        .populate('customerId')
                        .populate('products.productId')
                        .populate('userId');
        }
    }

    async update(id, data) {
        return await orderRepairModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteRole(id) {
        return await orderRepairModel.findByIdAndRemove(id);
    }
}

export default new orderRepairService();
