import brandService from "../services/brand.service";
import deepEqual from "deep-equal";

exports.create = async (req, res) => {
    try {
        if(!!req.body.name) {
            // console.log(req.body.name)
            const { name } = req.body;
            const isName = await brandService.findByName(name);
            const data = {
                name,
                logo: req.file ? req.file.path.split('uploads')[1].replace(/\\/g, '/') : '',
            }
            // console.log(data, 'databrand')
            if(!!isName) {
                res.json({mes: "Thương hiệu đã tồn tại!", status: false})
                return;
            }
            await brandService.create(data);
            res.send({mes: 'Thêm thành công!', status: true})
        }
        else {
            res.json({mes: 'Vui lòng nhập tên thương hiệu!', status: false})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.getAll = async (req, res) => {
    try {
        const brands = await brandService.getAll()
        res.json(brands)
    } catch(error) {
        console.log(error) 
        res.status(500).json({error})
    }
}

exports.update = async (req, res) => {
    try {   
        const id= req.query.id;
        const relativePath =  req.file.path.split('uploads')[1].replace(/\\/g, '/'); 
        const Nbrand = {
            name: req.body.name,
            logo: relativePath
        }
        const result = await brandService.update(id, Nbrand);
        res.json(result)
    } catch(error) {
        // console.log(error)
        console.log(error)
        res.status(500).json({error});
    }
}

exports.delete = async (req, res) => {
    try {
        const {id} = req.query;
        const result = await brandService.delete(id)
            !!result=== true ? res.json({mes:"Xóa thành công", status:true}) 
                             : res.json({mes:"Xóa không thành công", status:false})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.findById = async (req, res) => {
    try {   
        // console.log(req.body)
        const {brandId} = req.body
        const result = await brandService.findById(brandId)
        res.json(result)
    } catch(error) {
        console.log(error) 
        res.status(500).json({error})
    }
}