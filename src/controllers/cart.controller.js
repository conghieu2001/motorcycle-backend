import cartService from "../services/cart.service";

exports.create = async (req, res) => {
    try {
        const data = {
            products: req.body.products,
            userId: req.body.userId
        }
        await cartService.create(data)
        res.json({status: true})
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
        const result = await cartService.getAll({}, pageNumber, pageSize);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error });
      }
}

exports.update = async (req, res) => {
    try {
        // console.log(req.body)
        const result = await cartService.update(req.body.id, {products: req.body.products})
        res.json({status: true})
    }catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.delete = async (req, res) => {
    try {
        const {id} = req.query;
        await cartService.delete(id)
        res.json({mes:'Xóa thành công!'})
    }catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.findById = async (req, res) => {
    try {
        // console.log(req.body)
        const result = []
        const documents = await cartService.getAll()
        // console.log(documents)
        documents.forEach(e => {
            if(e.userId._id == req.body.id) {
                result.push(e)
            }
        })
        res.json({result})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}