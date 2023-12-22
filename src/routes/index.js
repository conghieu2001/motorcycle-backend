import userRouter from './user.route'
import brandRouter from './brand.route'
import businessRouter from './bussiness.route'
import categoryRouter from './category.route'
import productRouter from './product.route'
import accesstoryRouter from './accessory.route'
import inputProductRouter from './receipt.route'
import providerRouter from './provider.route'
import roleRouter from './role.route'
import staffRouter from './staff.route'
import departmentRouter from './department.route'
import orderRouter from './order.route'
import postRouter from './post.route'
import orderRepairRouter from './orderRepair.route'
import customerRouter from './customer.route'
import recruitmentRouter from './recruitment.route'
import guaranteeRouter from './guarantee.route'
import cartRouter from './cart.route'
import feedbackRouter from './feedback.route'

const routers = (app) => {
    app.use('/user', userRouter)
    app.use('/brand', brandRouter)
    app.use('/product', productRouter)
    app.use('/category', categoryRouter)
    app.use('/accesstory', accesstoryRouter)
    app.use('/bussiness', businessRouter)
    app.use('/receipt', inputProductRouter)
    app.use('/provider', providerRouter)
    app.use('/role', roleRouter)
    app.use('/staff', staffRouter)
    app.use('/department', departmentRouter)
    app.use('/order', orderRouter)
    app.use('/post', postRouter)
    app.use('/orderrepair', orderRepairRouter)
    app.use('/customer', customerRouter)
    app.use('/recruitment', recruitmentRouter)
    app.use('/guarantee', guaranteeRouter)
    app.use('/cart', cartRouter)
    app.use('/feedback', feedbackRouter)
    app.use('/', (req, res) => {
        res.send('Welcome to motocycle business Managent System')
    })
}

export default routers;