import guaranteeService from "../services/guarantee.service";
// import productService from "../services/product.service";
import accessoryService from '../services/accessory.service'
// import exceljs from 'exceljs'
import puppeteer from "puppeteer";

exports.create = async (req, res) => {
    try {
        // console.log(req.body)
        const sessionUser = req.session.auth
        // // console.log(req.body, image)
        const dataAccessories = req.body.accessories
        if(!!req.body) {
            const data = {
                productIdGuarantee: req.body.productId,
                orderId: req.body.orderId,
                notes: req.body.notes,
                accessories: req.body.accessories,
                userCreate: sessionUser.user._id
            }
            const result = await guaranteeService.create(data)
            if(result) {
                dataAccessories.forEach(async e => {
                // console.log(e)
                  await accessoryService.updateSaleQuantity(e.accessId, {saleQuantity: e.quantity})
                
              });
              res.json({mes: 'Tạo thành công', status: true });
            } else {
              res.json({ mes: 'Có lỗi xảy ra', status: false });
            }
        }
        else {
            res.json({mes: 'Vui lòng nhập dầy đủ các thông tin!'})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.getAll = async (req, res) => {
    try {
      // console.log('1')
        const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
        // console.log(pageNumber)
        const pageSize = req.query.pageSize ? req.query.pageSize : {}
        // console.log(pageSize)
        const result = await guaranteeService.getAll({}, pageNumber, pageSize);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.delete = async (req, res) => {
    try {
        const {id} = req.query;
        await guaranteeService.delete(id)
        res.json({mes:'Xóa thành công!'})
    }catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.findById = async (req, res) => {
    try {
        if(!!req.body.id) {
            const result = await guaranteeService.findById(req.body.id)
            res.json({result, status: true})
        } else {
            res.json({mes: 'không tìm thấy phiếu'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.exportPdf = async (req, res) => {
    try {
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();
        const content = req.body.data
        // console.log(content)
        await page.setContent(content)
        const blob = await page.pdf({
            format: 'A4',
            printBackground:true
        })
        // console.log(blob)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename = example.pdf')
        res.send(blob)
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}
// exports.findByIdExportPdf = async (req, res) => {
//     try {
//         // console.log(req.body.aaa)
//         const {aaa} = req.body
//         const result = await productService.findByIdExportPdf(aaa)
//         console.log(result)
//         res.json(result)
//     } catch (error) {
//         console.log(error)
//     }
// }