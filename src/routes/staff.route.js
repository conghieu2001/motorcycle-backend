import express from 'express'
import staffController from '../controllers/staff.controller'

const route = express.Router()

route.post('/create', staffController.create)
route.get('/getall', staffController.getAll)
route.post('/exportpdf', staffController.exportPdf)
route.post('/exportpdfdetail', staffController.exportPdfDetail)
route.post('/findbyid', staffController.findById)
route.post('/update', staffController.update)
// route.post('/update', staffController.updateRole)
// route.post('/updateroleuser', staffController.updateRoleUser)
// route.post('/removeupdateroleuser', staffController.removeUpdateRoleUser)


export default route;