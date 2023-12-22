import postModel from "../models/post.model";

class postService {
  async create(data) {
    return await postModel.create(data);
  }
  // async getAll() {
  //   return await postModel.find({}).populate("userId");
  // }
  async delete(id) {
    return await postModel.findByIdAndDelete(id);
  }
  async getAll(condition, pageNumber, pageSize) {
    // co phan trang
    if (!!pageNumber && !!pageSize) {
      const skip = (pageNumber - 1) * pageSize;
      // const sortCondition= sort ? sort: {createdAt:-1}
      return await postModel
        .find(condition)
        .populate("userId")
        .skip(skip)
        .limit(pageSize);
    }
    // khong phan trang && khong dung de find private key
    else {
      return await postModel
        .find(condition)
        .populate("userId")
    }
  }
  async findById(id) {
    return await postModel
                  .findById(id)
                  .populate("userId")
  }
  async update (id, data) {
    return await postModel.findByIdAndUpdate(id, {$set: data}, {returnDocument: 'after'})
  }
}
export default new postService();
