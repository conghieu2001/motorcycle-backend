import express from 'express'
import postController from '../controllers/post.controller'
import upload from '../utils/multer'

const route = express.Router()

route.post('/create', upload.single('postimg'), postController.create)
route.get('/getall', postController.getAll)
route.post('/update', upload.single('postimg'), postController.update)
route.post('/findbyid', postController.findById)
route.post('/delete', postController.delete)
route.post('/exportpdf', postController.exportPdf)
route.post('/findbyday', postController.findByDate)

export default route;