import receiptService from "../services/receipt.service";
import productService from "../services/product.service";
import accessoryService from '../services/accessory.service'
import exceljs from 'exceljs'
import puppeteer from "puppeteer";

exports.create = async (req, res) => {
    try {
      // console.log(req.body.ListProducts[0].productType)
        // console.log(req.session.auth.user.fullName)
        const sessionUser = req.session.auth
        // console.log(req.body, image)
        let sum = 0
        if(!!req.body) {
            const dataProducts = req.body.ListProducts
            dataProducts.forEach(e => {
                sum += e.inputPrice * e.inputQuantity
            });
            const image = !!req.file ? req.file.path.split('uploads')[1].replace(/\\/g, '/') : '';
            const data = {
                products: dataProducts,
                totalBill: sum,
                note: req.body.note,
                providerId: req.body.providerId,
                image: image,
                userCreate: sessionUser.user._id
            }
            const result = await receiptService.create(data)
            if(result) {
              dataProducts.forEach(async e => {
                // console.log(e)
                if(e.productType == 'product') {
                  await productService.findByIdAndUpdate(e.productId, {inputQuantity: e.inputQuantity, inputPrice: e.inputPrice})
                } else {
                  await accessoryService.findByIdAndUpdate(e.productId, {inputPrice: e.inputPrice, inputQuantity: e.inputQuantity})
                }
              });
              res.json({result, mes: 'Thêm phiếu nhập hàng thành công', status: true });
            } else {
              res.json({ mes: 'Có lỗi xảy ra', status: false });
            }
        }
        else {
            res.json({mes: 'Vui lòng nhập dầy đủ các thông tin trên phiếu!'})
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
        const result = await receiptService.findInputProduct({}, pageNumber, pageSize);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.delete = async (req, res) => {
    try {
        const {id} = req.query;
        await receiptService.delete(id)
        res.json({mes:'Xóa thành công!'})
    }catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.findById = async (req, res) => {
    try {
        if(!!req.body.id) {
            const result = await receiptService.findById(req.body.id)
            res.json({result})
        } else {
            res.json({mes: 'không tìm thấy phiếu'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.exportExcel = async (req, res) => {
    try {
        let workbook = new exceljs.Workbook()
        const sheet = workbook.addWorksheet("books")
        sheet.columns = [
            {header: "Tong hoa don", key: "tonghd", width: 50},
            {header: "Ten nha cung cap", key: "providerName", width: 50}
        ]
        // let object = JSON.parse()
        const result = await receiptService.getAll()
        let covertJson = JSON.parse(JSON.stringify(result))
        // console.log(covertJson)
        await covertJson.map((value, index) => {
            sheet.addRow({
                tonghd: value.tonghd,
                providerName: value.providerName
            })
        })
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        res.setHeader(
            "Content-Disposition",
            "attachment;filename=" + "books.xlsx"
        )
        workbook.xlsx.write(res)
    } catch (error) {
        console.log(error)
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
exports.findByIdExportPdf = async (req, res) => {
    try {
        // console.log(req.body.aaa)
        const {aaa} = req.body
        const result = await productService.findByIdExportPdf(aaa)
        console.log(result)
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}
exports.findByInputQuantity = async (req, res) => {
    try {
      if (!!req.body.data) {
        const { fromNumber, toNumber } = req.body.data;
        // console.log(req.body)
        // console.log(fromNumber, toNumber)
        const inputproducts = await receiptService.getAll();
        let result = [];
        for (const inputproduct of inputproducts) {
          if (
            inputproduct.totalBill >= fromNumber &&
            inputproduct.totalBill <= toNumber
          ) {
            result.push(inputproduct);
          }
        }
        // console.log(result.length)
        if(result.length>0) {
            res.json({result, status: true});
        } else {
          res.json({result, mes: 'Không có sản phẩm nào theo yêu cầu!', status: false})
        }
      } else {
          res.json({mes: 'có lỗi xảy ra'})
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  };

  exports.findByDate = async (req, res) => {
  
    const document = await receiptService.getAll();
    // console.log(today.getDate())
    var result = [];
    // console.log(req.body)
    if(!!req.body) {
      for (var i = 0; i < document.length; i++) {
        if (req.body.day) {
          const data = req.body.day
          const today = new Date(data);
          if (
            document[i].createdAt.getDate() == today.getDate() &&
            document[i].createdAt.getMonth() == today.getMonth() &&
            document[i].createdAt.getYear() == today.getYear()
          ) {
            result.push(document[i]);
            //   console.log(result)
          }
        } else if (req.body.month) {
          const month = new Date(req.body.month);
          if (
            document[i].createdAt.getMonth() == month.getMonth() &&
            document[i].createdAt.getYear() == month.getYear()
          ) {
            result.push(document[i]);
          }
        } else if (req.body.year) {
          const year = req.body.year;
          // console.log(year)
          // console.log(document[i].createdAt.getYear())
          if (
            document[i].createdAt.getFullYear() == year
          ) {
            result.push(document[i]);
          }
        }
      }
    } else {
      res.json({mes: "Chưa tìm kiếm!"})
    }
    res.json({result})
    
  };
  