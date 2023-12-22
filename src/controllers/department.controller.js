import departmentService from "../services/department.service";
import deepEqual from "deep-equal";

exports.create = async (req, res) => {
    try {
        if(!!req.body.name) {
            // console.log(req.body.name)
            const { name } = req.body;
            const isName = await departmentService.findByName(name);
            // console.log(!!isName)
            if(!!isName) {
                res.send({mes: "Phòng ban này đã tồn tại!", status: false})
            }
            else {
                await departmentService.create({name: name});
                res.send({mes: 'Thêm thành công!', status: true})
            }
        }
        else {
            res.json({mes: 'Vui lòng nhập tên phòng ban!', status: false})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.getAll = async (req, res) => {
    try {
        const result = await departmentService.getAll()
        res.json(result)
    } catch(error) {
        console.log(error) 
        res.status(500).json({error})
    }
}
