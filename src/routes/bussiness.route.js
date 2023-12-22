import express from 'express'
import bussinessController from '../controllers/bussiness.controller'
import upload from '../utils/multer'

const route = express.Router()
route.post('/create', bussinessController.create)
route.get('/getall', bussinessController.getAll)
route.post('/update', upload.single('imagebussiness'), bussinessController.update)


export default route;