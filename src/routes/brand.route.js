import express from 'express'
import brandController from '../controllers/brand.controller'
import upload from '../utils/multer'

const route = express.Router()

route.post('/create', upload.single('logobrand'), brandController.create)
route.get('/getall', brandController.getAll)
route.post('/update', upload.single('brand'), brandController.update)
route.delete('/delete', brandController.delete)
route.post('/findbyid', brandController.findById)


export default route;