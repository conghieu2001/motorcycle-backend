import express from 'express'
import roleController from '../controllers/role.controller'

const route = express.Router()

route.post('/create', roleController.createRole)
route.get('/getall', roleController.getAll)
route.post('/update', roleController.updateRole)
route.post('/updateroleuser', roleController.updateRoleUser)
// route.post('/removeupdateroleuser', roleController.removeUpdateRoleUser)


export default route;