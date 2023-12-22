import express from 'express'
import producController from '../controllers/product.controller'
import upload from '../utils/multer'

const route = express.Router()

route.post('/create', upload.single('imgproduct'), producController.create)
route.get('/getall', producController.getAll)
route.get('/getbyquantity', producController.getByQuantity)
route.get('/getpagination', producController.getPagination)
route.post('/update', upload.single('imgproduct'), producController.update)
route.delete('/delete', producController.delete)
route.post('/findbyid', producController.findById)
route.get('/getbyid/:id', producController.getById)
route.get('/getbyname', producController.findByName)
route.post('/findbycategoryid', producController.findByCategoryId)
route.post('/exportexcel', producController.exportExcel)
route.post('/exportpdf', producController.exportPdf)
route.post('/findbyidexportpdf', producController.findByIdExportPdf)
route.post('/findbyinputquantity', producController.findByInputQuantity)
route.post('/findbyinputprice', producController.findByInputPrice)
route.post('/findbysaleprice', producController.findBySalePrice)
route.post('/findbydate', producController.findByDate)
export default route