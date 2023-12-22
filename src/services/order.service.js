import orderModel from "../models/order.model";

class orderService {
    async create(data) {
        return await orderModel.create(data);
    }

    async findById(id) {
        // console.log(id)
        return await orderModel
            .findOne({_id: id})
            .populate('customerId')
            .populate('userId')
            .populate('products.productId')
            .lean();
    }

    async getAll(condition, pageNumber, pageSize) {
        // co phan trang
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            // const sortCondition= sort ? sort: {createdAt:-1}
            return await orderModel
                .find(condition)
                .populate('customerId')
                .populate('products.productId')
                .populate('userId')
                .skip(skip)
                .limit(pageSize);
            
        }
        // khong phan trang && khong dung de find private key
        else {
            return await orderModel.find(condition)
                        .populate('customerId')
                        .populate('products.productId')
                        .populate('userId');
        }
    }

    async update(id, data) {
        return await orderModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteRole(id) {
        return await orderModel.findByIdAndRemove(id);
    }
    async findByPhoneNumber(data) {
        return await orderModel.find({phoneNumber: data})
                    .populate('customerId')
                    .populate('userId')
                    .populate('products.productId')
                    .lean();
    }
}

export default new orderService();
