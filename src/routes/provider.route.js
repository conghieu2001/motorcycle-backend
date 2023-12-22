import express from 'express'
import providerController from '../controllers/provider.controller'
import upload from '../utils/multer'

const route = express.Router()

route.post('/create', providerController.create)
route.get('/getall', providerController.getAll)


export default route;