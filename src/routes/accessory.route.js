import express from 'express'
import accessoryController from '../controllers/accessory.controller'
import upload from '../utils/multer'

const route = express.Router()

route.post('/create', upload.single('accessoryimg'), accessoryController.create)
route.get('/getall', accessoryController.getAll)
route.get('/getbyquantity', accessoryController.getByQuantity)
route.post('/update', upload.single('accessoryimg'), accessoryController.update)
route.delete('/delete', accessoryController.delete)
route.post('/findbyname', accessoryController.findByName)
route.post('/exportpdf', accessoryController.exportPdf)
route.post('/findbyid', accessoryController.findById)
route.post('/findbyidupdate', accessoryController.findByIdUpdate)

export default route