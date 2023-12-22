import guaranteeModel from "../models/guarantee.model";

class guaranteeService {
  async create(data) {
    return await guaranteeModel.create(data);
  }
  async delete(id) {
    return await guaranteeModel.findByIdAndDelete(id);
  }
  async update(id, data) {
    return await guaranteeModel.findByIdAndUpdate(id, data);
  }
  async getAll(condition, pageNumber, pageSize) {
    // co phan trang
    if (!!pageNumber && !!pageSize) {
      const skip = (pageNumber - 1) * pageSize;
      // const sortCondition= sort ? sort: {createdAt:-1}
      return await guaranteeModel
        .find(condition)
        .populate("productIdGuarantee")
        .populate("orderId")
        .populate("accessories.accessId")
        .populate("userCreate")
        .skip(skip)
        .limit(pageSize);
    }
    // khong phan trang && khong dung de find private key
    else {
      return await guaranteeModel
        .find(condition)
        .populate("productIdGuarantee")
        .populate("orderId")
        .populate("accessories.accessId")
        .populate("userCreate")
    }
  }
  async findById(id) {
    return await guaranteeModel
                  .findById(id)
                  .populate("productIdGuarantee")
                  .populate("orderId")
                  .populate("accessories.accessId")
                  .populate("userCreate")
  }
}
export default new guaranteeService();
