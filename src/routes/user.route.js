import express from "express";
import userController from '../controllers/user.controller';
import passport from "passport";
import jwt  from "jsonwebtoken";
import upload from "../utils/multer";
const route = express.Router()

route.post('/register', userController.register)
route.post('/login', userController.login)
route.get('/logout', userController.logout)
route.post('/forget',userController.forgetPassWord)
route.post('/confirmcode',userController.confirmCode)
route.post('/confirmcodecreate',userController.confirmCodeCreate)
route.post('/changepass',userController.changePass)
route.post('/resetpass',userController.resetPass)
route.post('/update',upload.single('image'),userController.updateUser)
route.get('/getall',userController.getUser)
route.get('/getuserbyid',userController.getUserById)
route.get('/getpagination', userController.getPagination)
route.get('/uptostaff/:id', userController.upToStaff)
route.get('/lockaccount/:id', userController.lockAccount)
route.get('/getstaff', userController.getStaff)
route.post('/exportpdf', userController.exportPdf)
// route.get('/getemail',userController.getByEmail)
route.get('/getuser',(req, res)=>{
    res.json(req.session.auth)
})


userController.loginGoogle()
function isLogged(req, res, next){
    // console.log(req.user)
    if(req.user){
        if(req.user._doc === undefined) {
            const user=req.user
            const token = jwt.sign({userId: user._id,isAdmin:user.isAdmin, roles:user.roles},process.env.PRIVATE_KEY_TOKEN,{expiresIn:'4h'})
            req.session.auth = {
                token,
                user: {
                    ...user
                }
            }
            next()
        }
        else {
            const user=req.user._doc
            const token = jwt.sign({userId: user._id,isAdmin:user.isAdmin, roles:user.roles},process.env.PRIVATE_KEY_TOKEN,{expiresIn:'4h'})
            req.session.auth = {
                token,
                user: {
                    ...user
                }
            }
            next()
        }
    }else{
        res.send('lỗi đăng nhập')
    }
}

route.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}))
route.get('/google/callback', passport.authenticate('google', { failureRedirect:'/home'}), isLogged,(req , res)=>{
   // chuyển hướng về vue
//    console.log(req.session.auth);
    res.redirect(`http://localhost:3001`);
    // res.json(req.user)
})

route.post('/updateavatar', upload.single('avatar'), userController.updateavatar)
export default route;