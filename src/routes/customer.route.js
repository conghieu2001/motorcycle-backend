import express from 'express'
import customerController from '../controllers/customer.controller'
import upload from '../utils/multer'

const route = express.Router()

// route.post('/create', customerController.create)
route.get('/getall', customerController.getAll)
// route.post('/update', upload.single('brand'), customerController.update)
// route.delete('/delete', customerController.delete)
route.post('/findbyid', customerController.findById)


export default route;