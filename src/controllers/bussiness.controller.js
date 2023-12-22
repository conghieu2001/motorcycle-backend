import bussinessService from "../services/bussiness.service";
import deepEqual from "deep-equal";

exports.getAll = async (req, res) => {
    try {
        const brands = await bussinessService.getAll()
        res.json(brands)
    } catch(error) {
        console.log(error) 
        res.status(500).json({error})
    }
}
exports.create = async (req, res) => {
    // console.log(req.body)
    const data = {
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        mst: req.body.mst,
        ndd: req.body.ndd,
        nameVT: req.body.nameVT,
        nameVT1: req.body.nameVT1,
        nameVT2: req.body.nameVT2,
        addressVT: req.body.addressVT,
        nameBank: req.body.nameBank,

    }
    const response = await bussinessService.create(data)
    res.json(response)
}
exports.update = async (req, res) => {
    try {
        // const userLogin = req.session.auth;
        // console.log(userLogin)
        if(!!req.body) {
            const getBussiness = await bussinessService.getAll()
            const bussiness = {
                name: getBussiness.name,
                logo: getBussiness.logo,
                address: getBussiness.address,
                phoneNumber: getBussiness.phoneNumber,
                email: getBussiness.email,
                mst: getBussiness.mst,
                ndd: getBussiness.ndd,
                nameVT: getBussiness.nameVT,
                nameVT1: getBussiness.nameVT1,
                nameVT2: getBussiness.nameVT,
                addressVT: getBussiness.addressVT,
                namebank: getBussiness.nameBank
            }
            const bussinessChange ={
                name: req.body.name,
                logo: req.file ? req.file.path.split('uploads')[1].replace(/\\/g, '/') : getBussiness.logo,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                mst: req.body.mst,
                ndd: req.body.ndd,
                nameVT: req.body.nameVT,
                nameVT1: req.body.nameVT1,
                nameVT2: req.body.nameVT2,
                addressVT: req.body.addressVT,
                nameBank: req.body.nameBank
            }
            // console.log(req.body);
            // console.log(bussiness, 'bs')
            const isEqual = deepEqual(bussiness, bussinessChange);
            if(!isEqual) {
                    const result = await bussinessService.update(getBussiness._id, bussinessChange)
                    console.log(result)
                    
                    res.json({mes: 'Thông tin đã được cập nhật!', status: true})
                    
                
            }
            else{
                res.json({mes:'Không có sự thay đổi', status: false});
            }
        }
        else{
            res.json({mes:'Bạn chưa đăng nhập'})
        }
    }
    catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}
