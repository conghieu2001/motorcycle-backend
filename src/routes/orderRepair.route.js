import express from 'express'
import orderrepairController from '../controllers/orderRepair.controller'
// import upload from '../utils/multer'
const route = express.Router()

route.post('/create', orderrepairController.create)
route.get('/getall', orderrepairController.getAll)
route.post('/findbyid', orderrepairController.findById)
route.post('/exportpdf', orderrepairController.exportPdf)
route.post('/findbytotalbill', orderrepairController.findByInputQuantity)
route.get('/vnpay_return', orderrepairController.vnpayReturn)
route.post('/update', orderrepairController.update)
route.post('/cancelorder', orderrepairController.cancelOrder)
route.post('/getsales', orderrepairController.sales)
route.get('/momo_return', orderrepairController.momoReturn)

export default route