import customerService from "../services/customer.service";
import orderRepairService from "../services/orderRepair.service";
// import prodcutService from '../services/product.service'
import acessService from '../services/accessory.service'
// import bcrypt from "bcrypt";
import puppeteer from "puppeteer";
// import deepEqual from "deep-equal";
import moment from 'moment';
import 'moment/locale/vi'
import mailer from '../utils/mailler'
// import paypal from 'paypal-rest-sdk'
// import dateFormat from 'dateformat'
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

exports.getAll = async (req, res) => {
    try {
        let documents = [];
        // console.log(req.body)
        const pageNumber = req.query.pageNumber ? req.query.pageNumber : {};

        const pageSize = req.query.pageSize ? req.query.pageSize : {};

        const result = await orderRepairService.getAll({}, pageNumber, pageSize);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
};
exports.create = async (req, res) => {
    try {
        // console.log(req.body) 
        const userLogin = req.session.auth;
        // console.log(userLogin.user._id)
        if (!!userLogin) {
            if (req.body) {
                const { name, phoneNumber, address, email, methodPay, notes, ListProducts, totalBill, type, customerID, staffId, wage } = req.body
                if (methodPay === 'paycash') {
                    const dataCustomer = {
                        name: name,
                        phoneNumber: phoneNumber,
                        address: address,
                        email: email,
                    }
                    let resultCustomer = ''
                    if (type === 'update') {
                        resultCustomer = await customerService.update(customerID, dataCustomer)
                    } else {
                        const checkPhoneNumber = await customerService.findByPhoneNumber(phoneNumber)
                        // console.log(checkPhoneNumber)
                        if (checkPhoneNumber) {
                            //update
                            resultCustomer = await customerService.update(checkPhoneNumber._id, dataCustomer)
                        } else {
                            //create
                            resultCustomer = await customerService.create(dataCustomer)
                        }
                    }
                    // console.log(resultCustomer)
                    //create

                    const dataOrder = {
                        customerId: resultCustomer._id,
                        staffId: staffId,
                        userId: userLogin.user._id,
                        methodPay: methodPay,
                        notes: notes,
                        products: ListProducts,
                        totalBill: totalBill,
                        wage: wage,
                        status: 'Hoàn thành',
                        address: resultCustomer.address,
                        phoneNumber: resultCustomer.phoneNumber
                    }
                    const resultOrder = await orderRepairService.create(dataOrder)
                    ListProducts.forEach(async e => {     
                        await acessService.updateSaleQuantity(e.productId, { saleQuantity: e.saleQuantity, inputQuantity: e.inputQuantity })
                    });
                    res.json({ resultOrder, mes: 'Thanh toán đơn hàng thành công!', status: true })

                } else if(methodPay === 'momo') {
                    const cookie = { name, phoneNumber, address, email, methodPay, notes, ListProducts, totalBill, checkOrder: 'create', type, customerID, staffId, wage }
                    res.cookie('bodyCart', cookie);

                    const amount = totalBill
                    const partnerCode = "MOMO";
                    const accessKey = "F8BBA842ECF85";
                    const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
                    const requestId = partnerCode + new Date().getTime();
                    const orderId = requestId;
                    const orderInfo = "pay with MoMo";
                    const requestType = "captureWallet"
                    const extraData = "";
                    const ipnUrl = "http://localhost:3000/orderrepair/momo_return"
                    const redirectUrl = "http://localhost:3000/orderrepair/momo_return"

                    const rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
                    // console.log(rawSignature)
                    const crypto = require('crypto');
                    const signature = crypto.createHmac('sha256', secretkey)
                        .update(rawSignature)
                        .digest('hex');
                    // console.log("--------------------SIGNATURE----------------")
                    // console.log(signature)

                    const requestBody = {
                        partnerCode: partnerCode,
                        accessKey : accessKey,
                        requestId : requestId,
                        amount : amount,
                        orderId: orderId,
                        orderInfo: orderInfo,
                        redirectUrl: redirectUrl,
                        ipnUrl: ipnUrl,
                        requestType: requestType,
                        extraData: extraData,
                        lang:  "vi",
                        signature: signature
                    }
                    const https = require('https');
                    const requestBodyString = JSON.stringify(requestBody);
                    // console.log(typeof(requestBodyString))
                    const options = {
                        hostname: 'test-payment.momo.vn',
                        port: 443,
                        path: '/v2/gateway/api/create',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(requestBodyString)
                        }
                    }
                    //Send the request and get the response
                    const reqgetlink = https.request(options, resgetlink => {
                        let linksend = ''
                        // console.log(`Status: ${res.statusCode}`);
                        // console.log(`Headers: ${JSON.stringify(res.headers)}`);
                        resgetlink.setEncoding('utf8');
                        resgetlink.on('data', (body) => {
                            // console.log('Body: ');
                            // console.log(body);
                            // console.log('payUrl: ');
                            // console.log(JSON.parse(body).payUrl);
                            linksend += body
                            res.send(linksend);
                        });
                        resgetlink.on('end', () => {
                            // console.log('No more data in response.');
                            // const parsedData = JSON.parse(linksend);
                            //         const payUrl = parsedData.payUrl;
                            //         console.log(payUrl)
                            //         res.redirect(payUrl);
                        });
                    })
                    reqgetlink.on('error', (e) => {
                        console.log(`problem with request: ${e.message}`);
                    });
                    // write data to request body
                    // console.log("Sending....")
                    reqgetlink.write(requestBodyString);
                    reqgetlink.end();
                }
                else {
                    const cookie = { name, phoneNumber, address, email, methodPay, notes, ListProducts, totalBill, checkOrder: 'create', type, customerID, staffId, wage }
                    res.cookie('bodyCart', cookie);
                    let ipAddr = req.headers['x-forwarded-for'] ||
                        req.connection.remoteAddress ||
                        req.socket.remoteAddress ||
                        req.connection.socket.remoteAddress;


                    let date = new Date();
                    let createDate = moment(date).format('YYYYMMDDHHmmss');
                    let orderId = moment(date).format('DDHHmmss');

                    let tmnCode = '35WFO8TD';
                    let secretKey = 'ORKLOXKGTUIFJVRTITQXOTGJKHJXLJMO'
                    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
                    let returnUrl = 'http://localhost:3000/orderrepair/vnpay_return';


                    let amount = req.body.totalBill;
                    let bankCode = 'VNBANK';

                    let orderInfo = req.body.orderDescription;
                    // let orderType = req.body.orderType;

                    let currCode = 'VND';
                    let vnp_Params = {};
                    vnp_Params['vnp_Version'] = '2.1.0';
                    vnp_Params['vnp_Command'] = 'pay';
                    vnp_Params['vnp_TmnCode'] = tmnCode;
                    // vnp_Params['vnp_Merchant'] = ''
                    vnp_Params['vnp_Locale'] = 'vn';
                    vnp_Params['vnp_CurrCode'] = currCode;
                    vnp_Params['vnp_TxnRef'] = orderId;
                    vnp_Params['vnp_OrderInfo'] = 'Mã giao dịch' + orderInfo;
                    vnp_Params['vnp_OrderType'] = 'other';
                    vnp_Params['vnp_Amount'] = amount * 100;
                    vnp_Params['vnp_ReturnUrl'] = returnUrl;
                    vnp_Params['vnp_IpAddr'] = ipAddr;
                    vnp_Params['vnp_CreateDate'] = createDate;

                    vnp_Params = sortObject(vnp_Params);

                    let querystring = require('qs');
                    let signData = querystring.stringify(vnp_Params, { encode: false });
                    let crypto = require("crypto");
                    let hmac = crypto.createHmac("sha512", secretKey);
                    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
                    vnp_Params['vnp_SecureHash'] = signed;
                    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

                    res.send(vnpUrl)
                }

            } else {
                res.json({ mes: 'Điền đầy đủ thông tin' })
            }
        }
        else {
            res.json({ mes: 'Bạn chưa đăng nhập' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
};
exports.vnpayReturn = async (req, res) => {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = '35WFO8TD';
    let secretKey = 'ORKLOXKGTUIFJVRTITQXOTGJKHJXLJMO'

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

    const body = req.cookies.bodyCart
    // console.log(body.checkOrder)
    if (body.checkOrder === 'create') {
        if (vnp_Params['vnp_ResponseCode'] == '00') {
            const dataCustomer = {
                name: body.name,
                phoneNumber: body.phoneNumber,
                address: body.address,
                email: body.email,
            }
            let resultCustomer = ''
            if (body.type === 'update') {
                resultCustomer = await customerService.update(body.customerID, dataCustomer)
            } else {
                const checkPhoneNumber = await customerService.findByPhoneNumber(body.phoneNumber)
                // console.log(checkPhoneNumber)
                if (checkPhoneNumber) {
                    //update
                    resultCustomer = await customerService.update(checkPhoneNumber._id, dataCustomer)
                } else {
                    //create
                    resultCustomer = await customerService.create(dataCustomer)
                }
            }
            // console.log(resultCustomer)
            //create

            const dataOrder = {
                customerId: resultCustomer._id,
                staffId: body.staffId,
                userId: req.session.auth.user._id,
                methodPay: body.methodPay,
                notes: body.notes,
                products: body.ListProducts,
                totalBill: body.totalBill,
                wage: body.wage,
                status: 'Hoàn thành',
                address: resultCustomer.address,
                phoneNumber: resultCustomer.phoneNumber
            }
            const resultOrder = await orderRepairService.create(dataOrder)
            body.ListProducts.forEach(async e => {     
                await acessService.updateSaleQuantity(e.productId, { saleQuantity: e.saleQuantity, inputQuantity: e.inputQuantity })
            });
            // await mailer.sendEmail(body.email, `Kính gửi: Anh (chị) ${body.name} ,Cảm ơn anh (chị) mua hàng tại hệ thống chúng tôi. Chúc anh (chị) một ngày vui vẻ!`)
            res.clearCookie("bodyCart");
            // res.redirect('http://localhost:3001/admin/addorderrepair/?isPay=true')
            // res.json({mes: 'thành công', body})
            if (secureHash === signed) {
                //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
                // ?id=${resultOrder._id}
                res.redirect(`http://localhost:3001/admin/addorderrepair/?isPay=true&id=${resultOrder._id}`)
            } else {
                res.redirect('http://localhost:3001/admin/addorderrepair/?isPay=false')
                // res.json({ mes: 'thất bại' })
            }
            // console.log(body)
        } else {
            const dataCustomer = {
                name: body.name,
                phoneNumber: body.phoneNumber,
                address: body.address,
                email: body.email,
            }
            let resultCustomer = ''
            if (body.type === 'update') {
                resultCustomer = await customerService.update(body.customerID, dataCustomer)
            } else {
                const checkPhoneNumber = await customerService.findByPhoneNumber(body.phoneNumber)
                // console.log(checkPhoneNumber)
                if (checkPhoneNumber) {
                    //update
                    resultCustomer = await customerService.update(checkPhoneNumber._id, dataCustomer)
                } else {
                    //create
                    resultCustomer = await customerService.create(dataCustomer)
                }
            }
            // console.log(resultCustomer)  
            //create

            const dataOrder = {
                customerId: resultCustomer._id,
                staffId: body.staffId,
                userId: req.session.auth.user._id,
                methodPay: body.methodPay,
                notes: body.notes,
                products: body.ListProducts,
                totalBill: body.totalBill,
                wage: body.wage,
                status: 'Chờ thanh toán',
                address: resultCustomer.address,
                phoneNumber: resultCustomer.phoneNumber
            }
            const resultOrder = await orderRepairService.create(dataOrder)
            body.ListProducts.forEach(async e => {     
                await acessService.updateSaleQuantity(e.productId, { saleQuantity: e.saleQuantity, inputQuantity: e.inputQuantity })
            });
            // await mailer.sendEmail(body.email, `Kính gửi: Anh (chị) ${body.name} ,Cảm ơn anh (chị) mua hàng tại hệ thống chúng tôi. Chúc anh (chị) một ngày vui vẻ!`)
            res.clearCookie("bodyCart");
            // res.json({ resultOrder })
            res.redirect(`http://localhost:3001/admin/addorderrepair/?isPay=false&id=${resultOrder._id}`)

            // console.log(body)
        }

    } else {
        if (vnp_Params['vnp_ResponseCode'] == '00') {
            // console.log('1')
            const updateCustomer = await customerService.update(body.customerId._id, {name: body.customerId.name, phoneNumber: body.customerId.phoneNumber, email: body.customerId.email, address: body.customerId.address})
            const updateRepair = await orderRepairService.update(body._id, { notes: body.notes, status: "Hoàn thành", methodPay: body.methodPay, phoneNumber: body.customerId.phoneNumber, address: body.customerId.address })
            // await mailer.sendEmail(body.customerId.email, `Kính gửi: Anh (chị) ${body.customerId.name} ,Cảm ơn anh (chị) mua hàng tại hệ thống chúng tôi. Chúc anh (chị) một ngày vui vẻ!`)
            res.clearCookie("bodyCart");
            if (secureHash === signed) {
                //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
                // ?id=${resultOrder._id}
                res.redirect(`http://localhost:3001/admin/adminorderrepair/?isPay=true&id=${body._id}`)
            } else {
                res.redirect('http://localhost:3001/admin/adminorderrepair/?isPay=false')
                // res.json({ mes: 'thất bại' })
            }
        } else {
            // console.log('2')
            res.clearCookie("bodyCart");
            // res.json({ resultOrder })
            res.redirect(`http://localhost:3001/admin/adminorderrepair/?isPay=false&id=${body._id}`)

        }
    }
}
exports.momoReturn = async (req, res) => {
    const  momo_Params = req.query;
    const body = req.cookies.bodyCart

    if(body.checkOrder === 'create') {
        if(momo_Params.resultCode == 0) {
            const dataCustomer = {
                name: body.name,
                phoneNumber: body.phoneNumber,
                address: body.address,
                email: body.email,
            }
            let resultCustomer = ''
            if (body.type === 'update') {
                resultCustomer = await customerService.update(body.customerID, dataCustomer)
            } else {
                const checkPhoneNumber = await customerService.findByPhoneNumber(body.phoneNumber)
                // console.log(checkPhoneNumber)
                if (checkPhoneNumber) {
                    //update
                    resultCustomer = await customerService.update(checkPhoneNumber._id, dataCustomer)
                } else {
                    //create
                    resultCustomer = await customerService.create(dataCustomer)
                }
            }
            // console.log(resultCustomer)
            //create

            const dataOrder = {
                customerId: resultCustomer._id,
                staffId: body.staffId,
                userId: req.session.auth.user._id,
                methodPay: body.methodPay,
                notes: body.notes,
                products: body.ListProducts,
                totalBill: body.totalBill,
                wage: body.wage,
                status: 'Hoàn thành',
                address: resultCustomer.address,
                phoneNumber: resultCustomer.phoneNumber
            }
            const resultOrder = await orderRepairService.create(dataOrder)
            body.ListProducts.forEach(async e => {     
                await acessService.updateSaleQuantity(e.productId, { saleQuantity: e.saleQuantity, inputQuantity: e.inputQuantity })
            });
            // await mailer.sendEmail(body.email, `Kính gửi: Anh (chị) ${body.name} ,Cảm ơn anh (chị) mua hàng tại hệ thống chúng tôi. Chúc anh (chị) một ngày vui vẻ!`)
            res.clearCookie("bodyCart");
            // res.redirect('http://localhost:3001/admin/addorderrepair/?isPay=true')
            // res.json({mes: 'thành công', body})
            res.redirect(`http://localhost:3001/admin/addorderrepair/?isPay=true&id=${resultOrder._id}`)
        } else {
            const dataCustomer = {
                name: body.name,
                phoneNumber: body.phoneNumber,
                address: body.address,
                email: body.email,
            }
            let resultCustomer = ''
            if (body.type === 'update') {
                resultCustomer = await customerService.update(body.customerID, dataCustomer)
            } else {
                const checkPhoneNumber = await customerService.findByPhoneNumber(body.phoneNumber)
                // console.log(checkPhoneNumber)
                if (checkPhoneNumber) {
                    //update
                    resultCustomer = await customerService.update(checkPhoneNumber._id, dataCustomer)
                } else {
                    //create
                    resultCustomer = await customerService.create(dataCustomer)
                }
            }
            // console.log(resultCustomer)  
            //create

            const dataOrder = {
                customerId: resultCustomer._id,
                staffId: body.staffId,
                userId: req.session.auth.user._id,
                methodPay: body.methodPay,
                notes: body.notes,
                products: body.ListProducts,
                totalBill: body.totalBill,
                wage: body.wage,
                status: 'Chờ thanh toán',
                address: resultCustomer.address,
                phoneNumber: resultCustomer.phoneNumber
            }
            const resultOrder = await orderRepairService.create(dataOrder)
            body.ListProducts.forEach(async e => {     
                await acessService.updateSaleQuantity(e.productId, { saleQuantity: e.saleQuantity, inputQuantity: e.inputQuantity })
            });
            // await mailer.sendEmail(body.email, `Kính gửi: Anh (chị) ${body.name} ,Cảm ơn anh (chị) mua hàng tại hệ thống chúng tôi. Chúc anh (chị) một ngày vui vẻ!`)
            res.clearCookie("bodyCart");
            // res.json({ resultOrder })
            res.redirect(`http://localhost:3001/admin/addorderrepair/?isPay=false&id=${resultOrder._id}`)
        }

    } else {
        if (momo_Params.resultCode == 0) {
            // console.log('1')
            const updateCustomer = await customerService.update(body.customerId._id, {name: body.customerId.name, phoneNumber: body.customerId.phoneNumber, email: body.customerId.email, address: body.customerId.address})
            const updateRepair = await orderRepairService.update(body._id, { notes: body.notes, status: "Hoàn thành", methodPay: body.methodPay, phoneNumber: body.customerId.phoneNumber, address: body.customerId.address })
            // await mailer.sendEmail(body.customerId.email, `Kính gửi: Anh (chị) ${body.customerId.name} ,Cảm ơn anh (chị) mua hàng tại hệ thống chúng tôi. Chúc anh (chị) một ngày vui vẻ!`)
            res.clearCookie("bodyCart");
            res.redirect(`http://localhost:3001/admin/adminorderrepair/?isPay=true&id=${body._id}`)
        } else {
            // console.log('2')
            res.clearCookie("bodyCart");
            // res.json({ resultOrder })
            res.redirect(`http://localhost:3001/admin/adminorderrepair/?isPay=false&id=${body._id}`)

        }
    }
}
exports.findById = async (req, res) => {
    try {
        // console.log(req.body)
        if (req.body) {
            const result = await orderRepairService.findById(req.body.id)
            res.json({ result, status: true })
        } else {
            res.json({ mes: "Không tìm thấy hóa đơn này!", status: false })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
exports.exportPdf = async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        const content = req.body.data
        // console.log(content)
        await page.setContent(content)
        const blob = await page.pdf({
            format: 'A4',
            printBackground: true
        })
        // console.log(blob)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename = example.pdf')
        res.send(blob)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
exports.findByInputQuantity = async (req, res) => {
    try {
        // console.log(req.body)
        if (!!req.body) {
            const { fromNumber, toNumber } = req.body;
            // console.log(req.body)
            // console.log(fromNumber, toNumber)
            const repairs = await orderRepairService.getAll();
            let result = [];
            for (const repair of repairs) {
                if (
                    repair.totalBill >= fromNumber &&
                    repair.totalBill <= toNumber
                ) {
                    result.push(repair);
                }
            }
            // console.log(result.length)
            if (result.length > 0) {
                res.json({ result, status: true });
            } else {
                res.json({ result, mes: 'Không có hóa đơn nào theo yêu cầu!', status: false })
            }
        } else {
            res.json({ mes: 'có lỗi xảy ra' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }

}
exports.update = async (req, res) => {
    try {
        if (req.body) {
            // console.log(req.body)
            const { customerId, notes, methodPay, totalBill, _id } = req.body
            if (methodPay == 'paycash') {
                const updateCustomer = await customerService.update(customerId._id, {name: customerId.name, phoneNumber: customerId.phoneNumber, email: customerId.email, address: customerId.address})
                const updateRepair = await orderRepairService.update(req.body._id, { notes: notes, status: "Đã thanh toán", methodPay: methodPay, phoneNumber: customerId.phoneNumber, address: customerId.address })
                if (updateCustomer && updateRepair) {
                    res.json({ mes: 'Thanh toán thành công' })
                } else {
                    res.json({ mes: 'Cập nhật thất bại!' })
                }
            } else if (methodPay == 'vnpay') {
                const cookie = { customerId, notes, methodPay, totalBill, _id, checkOrder: 'update' }
                res.cookie('bodyCart', cookie);
                let ipAddr = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;


                let date = new Date();
                let createDate = moment(date).format('YYYYMMDDHHmmss');
                let orderId = moment(date).format('DDHHmmss');

                let tmnCode = '35WFO8TD';
                let secretKey = 'ORKLOXKGTUIFJVRTITQXOTGJKHJXLJMO'
                let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
                let returnUrl = 'http://localhost:3000/orderrepair/vnpay_return';


                let amount = req.body.totalBill;
                let bankCode = 'VNBANK';

                let orderInfo = req.body.orderDescription;
                // let orderType = req.body.orderType;

                let currCode = 'VND';
                let vnp_Params = {};
                vnp_Params['vnp_Version'] = '2.1.0';
                vnp_Params['vnp_Command'] = 'pay';
                vnp_Params['vnp_TmnCode'] = tmnCode;
                // vnp_Params['vnp_Merchant'] = ''
                vnp_Params['vnp_Locale'] = 'vn';
                vnp_Params['vnp_CurrCode'] = currCode;
                vnp_Params['vnp_TxnRef'] = orderId;
                vnp_Params['vnp_OrderInfo'] = 'Mã giao dịch' + orderInfo;
                vnp_Params['vnp_OrderType'] = 'other';
                vnp_Params['vnp_Amount'] = amount * 100;
                vnp_Params['vnp_ReturnUrl'] = returnUrl;
                vnp_Params['vnp_IpAddr'] = ipAddr;
                vnp_Params['vnp_CreateDate'] = createDate;

                vnp_Params = sortObject(vnp_Params);

                let querystring = require('qs');
                let signData = querystring.stringify(vnp_Params, { encode: false });
                let crypto = require("crypto");
                let hmac = crypto.createHmac("sha512", secretKey);
                let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
                vnp_Params['vnp_SecureHash'] = signed;
                vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

                res.send(vnpUrl)
            } else {
                const cookie = { customerId, notes, methodPay, totalBill, _id, checkOrder: 'update' }
                res.cookie('bodyCart', cookie);

                const amount = totalBill
                const partnerCode = "MOMO";
                const accessKey = "F8BBA842ECF85";
                const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
                const requestId = partnerCode + new Date().getTime();
                const orderId = requestId;
                const orderInfo = "pay with MoMo";
                const requestType = "captureWallet"
                const extraData = "";
                const ipnUrl = "http://localhost:3000/orderrepair/momo_return"
                const redirectUrl = "http://localhost:3000/orderrepair/momo_return"

                const rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
                // console.log(rawSignature)
                const crypto = require('crypto');
                const signature = crypto.createHmac('sha256', secretkey)
                    .update(rawSignature)
                    .digest('hex');
                // console.log("--------------------SIGNATURE----------------")
                // console.log(signature)

                const requestBody = {
                    partnerCode: partnerCode,
                    accessKey : accessKey,
                    requestId : requestId,
                    amount : amount,
                    orderId: orderId,
                    orderInfo: orderInfo,
                    redirectUrl: redirectUrl,
                    ipnUrl: ipnUrl,
                    requestType: requestType,
                    extraData: extraData,
                    lang:  "vi",
                    signature: signature
                }
                const https = require('https');
                const requestBodyString = JSON.stringify(requestBody);
                // console.log(typeof(requestBodyString))
                const options = {
                    hostname: 'test-payment.momo.vn',
                    port: 443,
                    path: '/v2/gateway/api/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBodyString)
                    }
                }
                //Send the request and get the response
                const reqgetlink = https.request(options, resgetlink => {
                    let linksend = ''
                    // console.log(`Status: ${res.statusCode}`);
                    // console.log(`Headers: ${JSON.stringify(res.headers)}`);
                    resgetlink.setEncoding('utf8');
                    resgetlink.on('data', (body) => {
                        // console.log('Body: ');
                        // console.log(body);
                        // console.log('payUrl: ');
                        // console.log(JSON.parse(body).payUrl);
                        linksend += body
                        res.send(linksend);
                    });
                    resgetlink.on('end', () => {
                        // console.log('No more data in response.');
                        // const parsedData = JSON.parse(linksend);
                        //         const payUrl = parsedData.payUrl;
                        //         console.log(payUrl)
                        //         res.redirect(payUrl);
                    });
                })
                reqgetlink.on('error', (e) => {
                    console.log(`problem with request: ${e.message}`);
                });
                // write data to request body
                // console.log("Sending....")
                reqgetlink.write(requestBodyString);
                reqgetlink.end();
            }

        } else {
            res.json({ mes: 'Vui lòng nhập đầy đủ thông tin!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
exports.cancelOrder = async (req, res) => {
    try {
        // console.log(req.body)
        // console.log(result)
        if (!!req.body) {
            const result = await orderRepairService.findById(req.body.id)
            // console.log(result)
            result.products.forEach(async e => {
                await acessService.cancelOrder(e.productId, {saleQuantity: e.saleQuantity})
            });
            // console.log(req.body.id)
            const deleteOrder = await orderRepairService.update(req.body.id, { status: 'Đã hủy' })
            if (deleteOrder) {
                res.json({ mes: 'Hủy đơn hàng thành công', status: true })
            } else {
                res.json({ mes: 'Hủy đơn hàng thất bại!' })
            }
        } else {
            res.json({ mes: 'Không tìm thấy hóa đơn này!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
exports.sales = async (req, res) => {
    try {
        let result = []
        let result2 = []
        let result3 = []
        // console.log(req.body)
        if (!!req.body) {
            const documents = await orderRepairService.getAll()
            if (req.body.month) {
                let month = new Date(req.body.month);
                for (let i = 0; i < documents.length; i++) {
                    if (
                        documents[i].createdAt.getMonth() == month.getMonth() &&
                        documents[i].createdAt.getYear() == month.getYear()
                    ) {
                        result.push(documents[i]);
                    }
                }
                const y = month.getFullYear();
                const m = month.getMonth();
                // Kiểm tra xem tháng 2 có phải là năm nhuận hay không
                const isLeapYear = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
                // Lấy số ngày trong tháng
                const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                const index = isLeapYear ? daysInMonth[m] + 1 : daysInMonth[m];
                // console.log(result, index)
                for (let j = 1; j <= index; j++) {
                    result2[j] = 0
                }
                for (let j = 1; j <= index; j++) {
                    result3[j] = 0
                }
                for (let j = 1; j <= index; j++) {
                    // console.log(documents[i].products.length)
                    // console.log(result[j])
                    for (let k = 0; k < result.length; k++) {
                        // console.log(result[k].createdAt.getDate())
                        if (result[k].createdAt.getDate() == j && result[k].status == 'Hoàn thành') {
                            if (result2[j] == 0) {
                                result2[j] = result[k].totalBill
                            } else {
                                result2[j] += result[k].totalBill
                            }
                            const test = result[k].products
                            let expense = 0
                            for(let h = 0; h<test.length; h++) {
                                // console.log(test[h])
                                expense += test[h].inputPrice*test[h].saleQuantity                                
                            }
                            if (result3[j] == 0) {
                                result3[j] = expense
                                // result3[j] = result[k].products.inputPrice
                            } else {
                                result3[j] += expense
                                // result3[j] += result[k].products.inputPrice
                            }
                        }
                    }
                }
            } else if(req.body.year){
                const year = req.body.year
                for (let i = 0; i < documents.length; i++) {
                    if (
                        documents[i].createdAt.getFullYear() == year
                    ) {
                        result.push(documents[i]);
                    }
                }
                for (let j = 1; j <= 12; j++) {
                    result2[j] = 0
                }
                for (let j = 1; j <= 12; j++) {
                    result3[j] = 0
                }
                for (let j = 1; j <= 12; j++) {
                    for (let k = 0; k < result.length; k++) {
                        // console.log(result[k].createdAt.getDate())
                        if ((result[k].createdAt.getMonth() + 1) == j && result[k].status == 'Hoàn thành') {
                            if (result2[j] == 0) {
                                result2[j] = result[k].totalBill
                            } else {
                                result2[j] += result[k].totalBill
                            }
                            const test = result[k].products
                            let expense = 0
                            for(let h = 0; h<test.length; h++) {
                                // console.log(test[h])
                                expense += test[h].inputPrice*test[h].saleQuantity                                
                            }
                            if (result3[j] == 0) {
                                result3[j] = expense
                                // result3[j] = result[k].products.inputPrice
                            } else {
                                result3[j] += expense
                                // result3[j] += result[k].products.inputPrice
                            }
                        }
                    }
                }
            }
            // console.log( result2, result3)
            res.json({ result2, result3 })
        } else {
            res.json({ mes: 'Bạn chưa nhập yêu cầu!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}