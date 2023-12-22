import express from 'express'
import orderController from '../controllers/order.controller'
// import upload from '../utils/multer'
const route = express.Router()

route.post('/create', orderController.create)
route.post('/createbyonline', orderController.createByOnline)
route.get('/getall', orderController.getAll)
route.post('/findbyid', orderController.findById)
route.post('/exportpdf', orderController.exportPdf)
route.post('/findbytotalbill', orderController.findByInputQuantity)
route.get('/vnpay_return', orderController.vnpayReturn)
route.post('/update', orderController.update)
route.post('/cancelorder', orderController.cancelOrder)
route.post('/getsales', orderController.sales)
route.post('/findbyuserid', orderController.findByUserId)
route.post('/continuepayment', orderController.continuePayment)
route.post('/findbyphonenumber', orderController.findOrderByPhoneNumber)
route.post('/findorderidandupdate', orderController.findOrderIdAndUpdate)
route.get('/momo_return', orderController.momoReturn)
route.post('/customer', orderController.customer)
export default route