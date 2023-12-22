import roleService from '../services/role.service'
import userService from '../services/user.service'

exports.getAll = async (req, res) => {
    try {
        let documents = []
        // console.log(req.body)
        const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}

        const pageSize = req.query.pageSize ? req.query.pageSize : {}

        const result = await roleService.getAll({}, pageNumber, pageSize);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
}
exports.createRole = async (req, res) => {
    try {
        // console.log(req.body)
        if (req.body) {
            const result = await roleService.create(req.body)
            if (result)
                res.json({mes: 'Thêm thành công!', status: true})
            } else {
                res.json({mes: 'Thêm thất bại!', status: false})
            }
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.updateRole = async (req, res) => {
    try {
        if (req.body) {
            const result = await roleService.updateRole(req.body.id, req.body)
            if (result) {
                res.json({mes: 'Thay đổi thành công'})
            } else {
                res.json({mes: 'Thay đổi thất bại'})
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
}
exports.updateRoleUser = async (req, res) => {
    try {
        // console.log(req.body)
        const {roleId, userId, type} = req.body;
        const result = await userService.updateRole(type, userId, roleId)
        // console.log(result)
        if (result) {
            res.json({mes: 'Thay đổi thành công'})
        } else {
            res.json({mes: 'Thay đổi thất bại'})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
}
