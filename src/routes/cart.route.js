import express from 'express'
import cartController from '../controllers/cart.controller'

const route = express.Router()

route.post('/create', cartController.create)
route.get('/getall', cartController.getAll)
route.post('/update', cartController.update)
route.delete('/delete', cartController.delete)
route.post('/findbyid', cartController.findById)

export default route