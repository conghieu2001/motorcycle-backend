import customerService from "../services/customer.service";
import deepEqual from "deep-equal";
exports.getAll = async (req, res) => {
    try {
        const customers = await customerService.getAll()
        res.json(customers)
    } catch(error) {
        console.log(error) 
        res.status(500).json({error})
    }
}

exports.findById = async (req, res) => {
    try {   
        // console.log(req.body)
        const {id} = req.body
        const result = await customerService.findById(id)
        res.json(result)
    } catch(error) {
        console.log(error) 
        res.status(500).json({error})
    }
}