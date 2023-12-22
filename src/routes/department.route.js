import express from 'express'
import departmentController from '../controllers/department.controller'


const route = express.Router()

route.post('/create', departmentController.create)
route.get('/getall', departmentController.getAll)



export default route;