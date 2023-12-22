import categoryService from "../services/category.service";
import deepEqual from "deep-equal";

exports.create = async (req, res) => {
    try {
        // console.log(req.body);
        if(!!req.body.name) {
            const { name } = req.body;
            const isName = await categoryService.findByName(name);
            const data = {
                name,
            }
            if(!!isName) {
                res.json({mes: "Loại xe đã tồn tại!", status: false})
                return;
            }
            await categoryService.create(data);
            res.send({mes: 'Thêm thành công!', status: true})
        }
        else {
            res.json({mes: 'Vui lòng nhập loại xe!', status: false})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.getAll = async (req, res) => {
    try {
        const categorys = await categoryService.getAll()
        res.json(categorys)
    } catch(error) {
        console.log(error) 
        res.status(500).json({error})
    }
}
exports.delete = async (req, res) => {
    try {
        const {id} = req.query;
        const result = await categoryService.delete(id)
            !!result=== true ? res.json({mes:"Xóa thành công", status:true}) 
                             : res.json({mes:"Xóa không thành công", status:false})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.findByName = async (req, res) => {
    try{
        if(!!req.body.name) {
            const result = await categoryService.findByName(req.body.name)
            res.json({result, status: true})
        } else {
            res.json({mes: 'Không tìm thấy', status: false})
        }
    } catch(error) {
        console.log(error)
        res.status(500)
    }
}