import express from 'express'
import categoryController from '../controllers/category.controller'

const route = express.Router()

route.post('/create', categoryController.create)
route.get('/getall', categoryController.getAll)
route.delete('/delete', categoryController.delete)
route.post('/findbyname', categoryController.findByName)

export default route;