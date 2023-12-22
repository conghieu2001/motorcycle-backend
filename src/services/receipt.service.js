import inputproductModel from "../models/receipt.model";

class productService {
  async create(data) {
    return await inputproductModel.create(data);
  }
  async getAll() {
    return await inputproductModel.find({}).populate("providerId").populate("userCreate");
  }
  // async update(id, data) {
  //     return await inputproductModel.findByIdAndUpdate(id, {$set: data}, {returnDocument: 'after'})
  // }
  async delete(id) {
    return await inputproductModel.findByIdAndDelete(id);
  }
  async findInputProduct(condition, pageNumber, pageSize) {
    // co phan trang
    if (!!pageNumber && !!pageSize) {
      const skip = (pageNumber - 1) * pageSize;
      // const sortCondition= sort ? sort: {createdAt:-1}
      return await inputproductModel
        .find(condition)
        .populate("providerId")
        .populate("userCreate")
        .populate("products.productId")
        .skip(skip)
        .limit(pageSize);
    }
    // khong phan trang && khong dung de find private key
    else {
      return await inputproductModel
        .find(condition)
        .populate("userCreate")
        .populate("providerId")
        .populate("products.productId")
    }
  }
  async findById(id) {
    return await inputproductModel
                  .findById(id)
                  .populate("providerId")
                  .populate("userCreate")
                  .populate("products.productId");
  }
}
export default new productService();
