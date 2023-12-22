import express from 'express'
import inputProducController from '../controllers/receipt.controller'
import upload from '../utils/multer'
const route = express.Router()

route.post('/create', upload.single('inputorderImg'), inputProducController.create)
route.get('/getall', inputProducController.getAll)
route.delete('/delete', inputProducController.delete)
route.post('/findbyid', inputProducController.findById)
route.get('/exportExcel', inputProducController.exportExcel)
route.post('/exportpdf', inputProducController.exportPdf)
route.post('/findbyidexportpdf', inputProducController.findByIdExportPdf)
route.post('/findbythd', inputProducController.findByInputQuantity)
route.post('/findbydate', inputProducController.findByDate)
export default route