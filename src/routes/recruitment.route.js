import express from 'express'
import recruitmentController from '../controllers/recruitment.controller'

const route = express.Router()

route.post('/create', recruitmentController.create)
route.get('/getall', recruitmentController.getAll)
route.post('/update', recruitmentController.update)
route.post('/findbyid', recruitmentController.findById)
route.post('/delete', recruitmentController.delete)
route.post('/exportpdf', recruitmentController.exportPdf)
route.post('/findbyday', recruitmentController.findByDate)

export default route;