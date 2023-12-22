import accessoryService from "../services/accessory.service";

exports.create = async (req, res) => {
    try {
        if(!!req.body) {
            const image = !!req.file ? req.file.path.split('uploads')[1].replace(/\\/g, '/') : '';
            const data = {
                brandId: req.body.brandId,
                name: req.body.name,
                description: req.body.description,
                image: image,
                // warrantyTime: req.body.warrantyTime,
                salePrice: req.body.salePrice,
                fitProductId: req.body.fitProductId
            }
            await accessoryService.create(data)
            res.json({ mes: 'Thêm thành công', status: true });
        }
        else {
            res.json({mes: 'Vui lòng nhập dầy đủ các thông tin!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.getAll = async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber ? req.query.pageNumber : {};
        // console.log(pageNumber)
        const pageSize = req.query.pageSize ? req.query.pageSize : {};
        // console.log(pageSize)
        const result = await accessoryService.getAll({}, pageNumber, pageSize);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error });
      }
}

exports.update = async (req, res) => {
    try {
        // console.log(req.body)
        // const {id} = req.query;
        const getById = await accessoryService.findByIdUpdate(req.body._id)
        // console.log(getById)
        const image = !!req.file ? req.file.path.split('uploads')[1].replace(/\\/g, '/') : getById.image;
        // console.log(req.body, image)
        if(!!req.body) {
            const Nproduct = {
                ...req.body,
                image: image,
                fitProductId: req.body.fitProductId
            }
            await accessoryService.update(req.body._id, Nproduct)
            res.json({mes:'Cập nhật thành công!', status: true})
        }
        else {
            res.json({mes: 'Vui lòng nhập đầy đủ các thông tin!', status: false})
        }
    }catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.delete = async (req, res) => {
    try {
        const {id} = req.query;
        await accessoryService.delete(id)
        res.json({mes:'Xóa thành công!'})
    }catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

exports.findByName = async (req, res) => {
    let documents = [];
    try {
        const {name} = req.query
        if(!!name) {
            documents = await accessoryService.findByName(name);
            res.json(documents)
        }
        else {
            res.json({mes: 'Không có phụ kiện bạn tìm kiếm'})
        }
    } catch(error) {
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
exports.findById = async (req, res) => {
    try {
        // console.log(req.body.id)
        if(!!req.body.id) {
            const result = await accessoryService.findById(req.body.id)
            res.json({result})
        } else {
            res.json({mes: 'không tìm thấy sản phẩm này!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.findByIdUpdate = async (req, res) => {
    try {
        // console.log(req.body.id)
        if(!!req.body.id) {
            const result = await accessoryService.findByIdUpdate(req.body.id)
            res.json({result})
        } else {
            res.json({mes: 'không tìm thấy sản phẩm này!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}
exports.getByQuantity = async (req, res) => {
    try {
      const result = await accessoryService.getByQuantity()
      res.json(result)
    } catch (error) {
      console.log(error)
      res.status(500).json({error})
    }
  }