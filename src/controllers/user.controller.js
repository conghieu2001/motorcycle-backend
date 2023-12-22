import userService from "../services/user.service";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
import mailler from "../utils/mailler"
import codeService from "../services/code.service";
import deepEqual from "deep-equal";
import appRoot from 'app-root-path';
import puppeteer from "puppeteer";
// var multer = require("multer")
dotenv.config()

//đăng ký tài khoản
exports.register = async (req, res) => {
    try {
        // console.log(req.body)
        if(!!req.body) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //create
            const { email, phoneNumber, fullName } = req.body;
            const checkEmail = await userService.findByEmail(email);
            const checkPhoneNumber = await userService.findByPhoneNumber(phoneNumber);
            if(checkEmail || checkPhoneNumber) {
                res.json({mes: 'Email hoặc sđt đã tồn tại!'});
                return;
            } else {
                if(!!!req.body.chekedCode) {
                    let numbers = '';
                    for(let i = 0; i < 6; i++) {
                        let randomNumber = Math.floor(Math.random() *10);
                        numbers += randomNumber;
                    }
                    const result = await mailler.sendEmail(email, numbers, 'Mã xác nhận')
                    if(!!result) {
                        await codeService.create({
                            emailUser:email,
                            codeNumber:numbers,
                            resetTokenExpires: Date.now() + 60000
                        })
                        res.json({status: true})
                    }
                    else {
                        res.json({mes: 'Có lỗi khi gửi mã xác nhận!',status: false})
                    } 
                }
                else {
                    const data = {
                        fullName: fullName,
                        email: email,
                        password: hashed,
                        phoneNumber: phoneNumber,
                    }
                    const result = await userService.register(data);
                    result ? res.json({mes: 'Đăng ký thành công!', status: true}) : res.json({mes: 'Đăng ký thất bại!', status: false});
                }
            }
        } else {
            res.json({mes: 'Vui lòng điền đầy đủ thông tin!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
//nhập code create user
exports.confirmCodeCreate = async (req, res) => {
    try {
        // console.log(req.body)
        const { code, email } = req.body;
        const codeConfirm = await codeService.findAllByEmailCreate(email);
        // console.log(codeConfirm)
        if(codeConfirm.length !== 0) {
            if(codeConfirm[0].codeNumber == code) {
                await codeService.updateCodeCreateUsed(email, code)
                res.json({mes: true, status: true})
            }
            else {
                res.json({mes:false, mes:'Mã xác thực không chính xác'})
            }
        }
        else {
            res.json({mes: 'Mã xác thực đã hết thời hạn!', status:false})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.login = async (req, res) => {
    try {
    //    console.log(req.body)
        if(!!!req.session.auth) {
            const { accountName, password} = req.body;
            const userEmail = await userService.findByEmail(accountName)
            const userPhoneNumber = await userService.findByPhoneNumber(accountName)
            // console.log(userEmail, userPhoneNumber)
            if(!!userEmail || !!userPhoneNumber) {
                let user = {}
                if(!!userEmail) {
                    user = userEmail
                } else {
                    user = userPhoneNumber
                }
                const validPassword = bcrypt.compareSync(
                    password,
                    user.password
                )
                // console.log(user)
                // console.log(validPassword)
                if(!!validPassword) {
                    if(user.locked == true) {
                        res.json({mes: 'Tài khoản đã bị khóa!', status: false})
                    } else {
                        delete user.password;
                        const token = jwt.sign({userId: user._id,isAdmin:user.isAdmin, roles:user.roles},process.env.PRIVATE_KEY_TOKEN,{expiresIn:'4h'})
                        req.session.auth = {
                            token,
                            user: {
                                ...user
                            }
                        }
                        // console.log(req.session.auth)
                        res.json({token, status: true, user:{ ...req.session.auth }})
                    }
                } 
                else {
                    res.json({mes: 'Mật khẩu không đúng!', status: false})
                }
            } 
            else {
                res.json({mes: 'Tên tài khoản không trùng khớp, vui lòng kiểm tra lại!!', status: false})
            }
        }
        else {
            res.json({mes: 'Bạn đã đăng nhập!', status: false})
        }
    }  catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.loginGoogle = async () =>{
    passport.use(new GoogleStrategy({
        clientID: '756357518863-0f0rgukj77trs4am8fq7u98ovh0ihh5t.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "http://localhost:3000/user/google/callback"
      },
      async function(accessToken, refreshToken, profile, done) {
        let user = await userService.findByEmail(profile.emails[0].value)
        // console.log(user)
        if(!!user){
            // user = user._doc
            return done(null,user)
        }
        else{
            const data={
                fullName: profile.displayName,
                email:profile.emails[0].value,
                avatar: profile.photos[0].value,
                isGoogle: true
            }
            user = await userService.register(data)
            // console.log(user)
            return done(null,user)
        }

      }
    ))
    passport.serializeUser(function(user, done) {
        done(null, {user:user});
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
}
//logout
exports.logout = (req, res) => {
    req.session.auth = undefined
    res.json({mes: 'Bạn đã đăng xuất!'})
}

//Quên mật khẩu
exports.forgetPassWord = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await userService.findByEmail(email);
        // console.log(user)
        if(!!user) {
            if(user.isGoogle == false) {
                let numbers = '';
                for(let i = 0; i < 6; i++) {
                    let randomNumber = Math.floor(Math.random() *10);
                    numbers += randomNumber;
                }
                const result = await mailler.sendEmail(email, numbers, 'Mã xác nhận')
                if(!!result) {
                    await codeService.create({
                        emailUser:user.email,
                        codeNumber:numbers,
                        resetTokenExpires: Date.now() + 60000
                    })
                    res.json({mes: 'Mã xác nhận đã được gửi!',status: true})
                }
                else {
                    res.json({mes: 'Có lỗi khi gửi mã xác nhận!',status: false})
                } 
            } else {
                res.json({mes: `Tài khoản với email ${email} được đăng nhập bằng google!`, status: false})
            }
        }
        else {
            res.json({mes: `Không có tài khoản nào được tạo với email ${email}!`, status: false})
        }
    } catch(error) {
        res.status(500).json({error})
    }
}
//nhập code
exports.confirmCode = async (req, res) => {
    try {
        const { code, email } = req.body;
        const codeConfirm = await codeService.findAllByEmail(email);
        // console.log(codeConfirm)
        if(codeConfirm.length !== 0) {
            if(codeConfirm[0].codeNumber == code) {
                await codeService.updateCodeUsed(email, code)
                res.json({mes: true, status: true})
            }
            else {
                res.json({mes:false, mes:'Mã xác thực không chính xác'})
            }
        }
        else {
            res.json({mes: 'Mã xác thực đã hết thời hạn!', status:false})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}
//đổi mật khẩu
exports.changePass = async (req, res) => {
    try {
        const auth = req.session.auth;
        // console.log(auth.user.email, 'auth')
        if(!!auth) {
            const user = await userService.findByEmail(auth.user.email);
            // console.log(user.password)
            const {password, newPassword} = req.body;
            // console.log({password},{user.password}, '123')
            const validPassword = await bcrypt.compare(
                password,
                user.password
            )
            // console.log(!!validPassword)
            if(!!validPassword) {
                const salt = await bcrypt.genSalt(10);
                const password = await bcrypt.hash(newPassword, salt);
                await userService.update(user._id, {password});
                res.json({mes: 'Mật khẩu đã được cập nhật!', status: true});
            }
            else {
                res.json({mes: 'Mật khẩu cũ không chính xác!', status: false});
            }
        }
        else {
            res.json({mes: 'Bạn chưa đăng nhập!', status: false});
        }
    } catch(error) {
        console.log(error);
    }
}
//update thông tin tài khoản
exports.updateUser = async (req, res) => {
    try {
        const userLogin = req.session.auth;
        // console.log(userLogin)
        if(!!userLogin) {
            const auth = {
                fullName: userLogin.user.fullName,
                email: userLogin.user.email,
                avatar: userLogin.user.avatar,
                phoneNumber: userLogin.user.phoneNumber
            }
            const userChange ={
                fullName: req.body.fullName,
                email: req.body.email,
                avatar: req.file ? req.file.path.split('uploads')[1].replace(/\\/g, '/') : userLogin.user.avatar,
                phoneNumber: req.body.phoneNumber,
            }
            // console.log(req.body);
            // console.log(auth, userChange, '1234')
            const isEqual = deepEqual(auth, userChange);
            if(!isEqual) {
                const checkEmail = await userService.isEmail(userLogin.user._id, req.body.email);
                const checkPhoneNumber = await userService.isPhoneNumber(userLogin.user._id, req.body.phoneNumber);
                if(checkEmail) {
                    res.json({mes: 'Email đã được sử dụng!', status: false})
                }
                else if(checkPhoneNumber) {
                    res.json({mes: 'SĐT đã được sử dụng!', status: false});
                }
                else {
                    const result = await userService.update(userLogin.user._id, userChange)
                    // console.log(result)
                    req.session.auth.user = {
                        ...result
                    }
                    res.json({mes: 'Thông tin đã được cập nhật!', status: true})
                    
                }
            }
            else{
                res.json({mes:'Không có sự thay đổi', status: false});
            }
        }
        else{
            res.json({mes:'Bạn chưa đăng nhập'})
        }
    }
    catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.updateavatar = async (req, res) => {
    try {
        const userLogin = req.session.auth;
        if(!!userLogin) { 
            if (req.fileValidationError) {
    
                return res.send(req.fileValidationError);
            }
            else if (!req.file) {
                return res.send('Please select an image to upload');
            }
            const avatarNew = {
                avatar: req.file.path.split('uploads')[1].replace(/\\/g, '/')
            }
            // console.log(avatarNew)
            const result = await userService.updateAvatar(userLogin._id, avatarNew);
            res.json({mes:'ok'})
        }
        else {
            res.json('Bạn chưa đăng nhập!')
        }
          
    } catch (error) {
        console.log(error)
    }
}
exports.getUser = async (req, res) => {
    try {
        const user = await userService.getAll()
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.resetPass = async (req, res) => {
    try {
        if(!!req.body) {
            const {email, password} = req.body;
            if(!!email) {
                const user = await userService.findByEmail(email); 
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(password, salt);
                // console.log(hashed)
                await userService.update(user._id, {password: hashed});
                res.json({mes:'Đặt lại mật khẩu thành công', status:true})
            } else {
                res.json({mes: 'Email chưa xác thực!', status: false})
            }
        } else {
            res.json({status: false, mes: '....'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.getUserById = async (req, res) => {
    // try {
    //     console.log(req.query)
    //     const result = await userService.findById(req.query.id)
    //     res.json(result)
    // }catch (error) {
    //     console.log(error)
    // }
}
exports.getPagination = async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
        // console.log(pageNumber)
        const pageSize = req.query.pageSize ? req.query.pageSize : {}
        // console.log(pageSize)
        const result = await userService.findUser({isAdmin: false}, pageNumber, pageSize);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
}
exports.upToStaff = async (req, res) => {
    try {
        const {id} = req.params
        if(!!id) {
            const getUser = await userService.findById(id)
            if(getUser.isStaff == true) {
                res.json({mes: 'Tài khoản này hiện đã là nhân viên! Bạn có thể cấp quyền cho tài khoản.'})
            } else {
                const userById = await userService.update(id, {isStaff: true})
                res.json({mes: 'Thành công!', status: true})
            }
        } else {
            res.json({mes: "Có lỗi xảy ra!!!"})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.lockAccount = async (req, res) => {
    try {
        const {id} = req.params
        console.log(id)
        if(!!id) {
            const userById = await userService.findById(id)
            if(userById.locked == false) {
                const result = await userService.update(id, {locked: true})
                res.json({mes: 'Lock thành công!', status: true})
            } else {
                const result = await userService.update(id, {locked: false})
                res.json({mes: 'Unlock thành công!', status: true})
            }
            
        } else {
            res.json({mes: 'Không tìm thấy tài khoản này!'})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.getStaff = async (req, res) => {
    try {
        const result = await userService.getStaff()
        res.json({result})
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.exportPdf = async (req, res) => {
    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      const content = req.body.data;
      // console.log(content)
      await page.setContent(content);
      const blob = await page.pdf({
        format: "A4",
        printBackground: true,
      });
      // console.log(blob)
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename = example.pdf");
      res.send(blob);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  };
