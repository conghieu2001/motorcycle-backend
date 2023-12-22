import grnModel from "../models/grn.model";

class grnService {
  async create(data) {
    return await grnModel.create(data);
  }
  async getAll() {
    return await grnModel.find({}).populate("providerId").populate("userCreate");
  }
  // async update(id, data) {
  //     return await grnModel.findByIdAndUpdate(id, {$set: data}, {returnDocument: 'after'})
  // }
  async delete(id) {
    return await grnModel.findByIdAndDelete(id);
  }
  async findInputProduct(condition, pageNumber, pageSize) {
    // co phan trang
    if (!!pageNumber && !!pageSize) {
      const skip = (pageNumber - 1) * pageSize;
      // const sortCondition= sort ? sort: {createdAt:-1}
      return await grnModel
        .find(condition)
        .populate("providerId")
        .populate("userCreate")
        .skip(skip)
        .limit(pageSize);
    }
    // khong phan trang && khong dung de find private key
    else {
      return await grnModel
        .find(condition)
        .populate("userCreate")
        .populate("providerId")
    }
  }
  async findById(id) {
    return await grnModel.findById(id).populate("providerId").populate("userCreate");
  }
}
export default new grnService();
