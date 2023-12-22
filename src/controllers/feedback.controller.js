import feedbackService from "../services/feedback.service";

exports.create = async (req, res) => {
    try {
        // console.log(req.body)
        if(!!req.body) {
            const data = {
                userId: req.body.userId,
                comment: req.body.comment,
                item: req.body.item,
                star: req.body.star,
                orderId: req.body.orderId 
            }
            await feedbackService.create(data)
            res.json({ mes: 'Cảm ơn quý khách đã đánh giá sản phẩm', status: true });
        }
        else {
            res.json({mes: 'Vui lòng nhập dầy đủ các thông tin!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.getAll = async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber ? req.query.pageNumber : {};
        // console.log(pageNumber)
        const pageSize = req.query.pageSize ? req.query.pageSize : {};
        // console.log(pageSize)
        const result = await feedbackService.getAll({}, pageNumber, pageSize);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error });
      }
}

exports.update = async (req, res) => {
    // try {
    //     // console.log(req.body)
    //     // const {id} = req.query;
    //     const getById = await feedbackService.findByIdUpdate(req.body._id)
    //     // console.log(getById)
    //     const image = !!req.file ? req.file.path.split('uploads')[1].replace(/\\/g, '/') : getById.image;
    //     // console.log(req.body, image)
    //     if(!!req.body) {
    //         const Nproduct = {
    //             ...req.body,
    //             image: image,
    //             fitProductId: req.body.fitProductId
    //         }
    //         await feedbackService.update(req.body._id, Nproduct)
    //         res.json({mes:'Cập nhật thành công!', status: true})
    //     }
    //     else {
    //         res.json({mes: 'Vui lòng nhập đầy đủ các thông tin!', status: false})
    //     }
    // }catch(error) {
    //     console.log(error)
    //     res.status(500).json({error})
    // }
}
exports.delete = async (req, res) => {
    try {
        // console.log(req.body.id)
        await feedbackService.delete(req.body.id)
        res.json({mes:'Xóa thành công!'})
    }catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.findById = async (req, res) => {
    try {
        // console.log(req.body.id)
        if(!!req.body.id) {
            const result = await feedbackService.findById(req.body.id)
            res.json({result})
        } else {
            res.json({mes: 'không tìm thấy đánh giá này!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.locked = async (req, res) => {
    try {
        if(!!req.body.id) {
            const result = await feedbackService.update(req.body.id, {locked: true})
            res.json({mes: 'Bạn đã duyệt đánh giá này!', status: true})
        } else {
            res.json({mes: 'không tìm thấy đánh giá này!', status: false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.unLocked = async (req, res) => {
    try {
        if(!!req.body.id) {
            const result = await feedbackService.update(req.body.id, {locked: false})
            res.json({mes: 'Mở khóa thành công đánh giá này', status: true})
        } else {
            res.json({mes: 'không tìm thấy đánh giá này!', status: false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}