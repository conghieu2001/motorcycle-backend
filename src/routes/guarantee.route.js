import express from 'express'
import guaranteeController from '../controllers/guarantee.controller'
const route = express.Router()

route.post('/create', guaranteeController.create)
route.get('/getall', guaranteeController.getAll)
route.delete('/delete', guaranteeController.delete)
route.post('/findbyid', guaranteeController.findById)
route.post('/exportpdf', guaranteeController.exportPdf)
// route.post('/findbyidexportpdf', guaranteeController.findByIdExportPdf)

export default route