import express from 'express'
import feedbackController from '../controllers/feedback.controller'

const route = express.Router()

route.post('/create', feedbackController.create)
route.get('/getall', feedbackController.getAll)
route.post('/update', feedbackController.update)
route.post('/delete', feedbackController.delete)
route.post('/findbyid', feedbackController.findById)
route.post('/locked', feedbackController.locked)
route.post('/unlocked', feedbackController.unLocked)

export default route