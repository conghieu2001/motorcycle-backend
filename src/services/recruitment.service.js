import recruitmentModel from "../models/recruitment.model";

class postService {
  async create(data) {
    return await recruitmentModel.create(data);
  }
  // async getAll() {
  //   return await recruitmentModel.find({}).populate("userId");
  // }
  async delete(id) {
    return await recruitmentModel.findByIdAndDelete(id);
  }
  async getAll(condition, pageNumber, pageSize) {
    // co phan trang
    if (!!pageNumber && !!pageSize) {
      const skip = (pageNumber - 1) * pageSize;
      // const sortCondition= sort ? sort: {createdAt:-1}
      return await recruitmentModel
        .find(condition)
        .populate("userId")
        .skip(skip)
        .limit(pageSize);
    }
    // khong phan trang && khong dung de find private key
    else {
      return await recruitmentModel
        .find(condition)
        .populate("userId")
    }
  }
  async findById(id) {
    return await recruitmentModel
                  .findById(id)
                  .populate("userId")
  }
  async update (id, data) {
    return await recruitmentModel.findByIdAndUpdate(id, {$set: data}, {returnDocument: 'after'})
  }
}
export default new postService();
