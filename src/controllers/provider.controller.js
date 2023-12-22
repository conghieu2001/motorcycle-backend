import providerService from "../services/provider.service";
import deepEqual from "deep-equal";

exports.create = async (req, res) => {
    try {
        if(!!req.body) {
            // console.log(req.body.name)
            const { name, address, phoneNumber, email } = req.body;
            
            await providerService.create({name: name, address: address, phoneNumber: phoneNumber, email: email});
            res.send({mes: 'Thêm thành công!', status: true})
        }
        else {
            res.json({mes: 'Vui lòng nhập đầy đủ dữ liệu!', status: false})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.getAll = async (req, res) => {
    try {
        const providers = await providerService.getAll()
        res.json(providers)
    } catch(error) {
        console.log(error) 
        res.status(500).json({error})
    }
}
