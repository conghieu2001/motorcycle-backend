import productService from "../services/product.service";
import exceljs from "exceljs";
import puppeteer from "puppeteer";
exports.create = async (req, res) => {
  try {
    // console.log(req.body.specs, 'spec')
    // console.log(req.body.specs.klbt, 'klbt')
    // console.log(req.body.klbt, 'klbt2')
    if (!!req.body) {
      const image = !!req.file
        ? req.file.path.split("uploads")[1].replace(/\\/g, "/")
        : "";
      const data = {
        brandId: req.body.brandId,
        category: req.body.categoryId,
        name: req.body.name,
        color: req.body.color,
        description: req.body.description,
        image: image,
        warrantyTime: req.body.warrantyTime,
        // inputQuantity: req.body.inputQuantity,
        salePrice: req.body.salePrice,
        // soldQuantity: req.body.soldQuantity
        specs: [
          {
            klbt: req.body.specs.klbt,
            drc: req.body.specs.drc,
            kctbx: req.body.specs.kctbx,
            dcy: req.body.specs.dcy,
            ksgx: req.body.specs.ksgx,
            dtbx: req.body.specs.dtbx,
            kclt: req.body.specs.kclt,
            pt: req.body.specs.pt,
            ps: req.body.specs.ps,
            ldc: req.body.specs.ldc,
            cstd: req.body.specs.cstd,
            dtnm: req.body.specs.dtnm,
            mttnl: req.body.specs.mttnl,
            ltd: req.body.specs.ltd,
            htkd: req.body.specs.htkd,
            mcd: req.body.specs.mcd,
            dtxl: req.body.specs.dtxl,
            tsn: req.body.specs.tsn,
            dkhtpt: req.body.specs.dkhtpt,
          },
        ],
      };
      await productService.create(data);
      res.json({ mes: "Thêm sản phẩm thành công", status: true });
    } else {
      res.json({ mes: "Vui lòng nhập dầy đủ các thông tin sản phẩm!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await productService.getAll();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.getPagination = async (req, res) => {
  try {
    const pageNumber = req.query.pageNumber ? req.query.pageNumber : {};
    const pageSize = req.query.pageSize ? req.query.pageSize : {};
    const result = await productService.findProduct({}, pageNumber, pageSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
};
exports.update = async (req, res) => {
  try {
    // console.log(req.query)
    // console.log(req.body)
    const id = req.body._id;
    // console.log(id)
    const inforProduct = await productService.findById(id);
    const Nimage = !!req.file
      ? req.file.path.split("uploads")[1].replace(/\\/g, "/")
      : inforProduct.image;
    // console.log(image)
    if (!!req.body) {
      const Nproduct = {
        ...req.body,
        image: Nimage,
      };
      await productService.update(id, Nproduct);
      res.json({ mes: "Cập nhật thành công!", status: true });
    } else {
      res.json({ mes: "Vui lòng nhập đầy đủ các thông tin!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.delete = async (req, res) => {
  try {
    const { id } = req.query;
    await productService.delete(id);
    res.json({ mes: "Xóa thành công!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.findById = async (req, res) => {
  try {
    // console.log(req.body);
    if (!!req.body.id) {
      const result = await productService.findById(req.body.id);
      res.json({ result, status: true });
    } else {
      res.json({ mes: "không tìm thấy sản phẩm", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.getById = async (req, res) => {
  try {
    // console.log(req.params);
    if (!!req.params.id) {
      const result = await productService.findById(req.params.id);
      res.json({ result, status: true });
    } else {
      res.json({ mes: "không tìm thấy sản phẩm", status: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.findByCategoryId = async (req, res) => {
  try {
    if (!!req.body.categoryId) {
      const result = await productService.findByCategoryId(req.body.categoryId);
      res.json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
exports.findByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (name) {
      const result = await productService.findByName(name);
      res.json({ result, status: true });
    } else {
      // res.json({mes: 'Không tìm thấy'})
      const result = await productService.getAll({});
      res.json({ result, status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.exportExcel = async (req, res) => {
  try {
    let workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet("products");
    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Color", key: "color", width: 10 },
      { header: "Description", key: "description", width: 50 },
      { header: "InputQuantity", key: "inputQuantity", width: 25 },
      { header: "InputPrice", key: "inputPrice", width: 25 },
      { header: "SalePrice", key: "salePrice", width: 25 },
      { header: "WarrantyTime", key: "warrantyTime", width: 25 },
    ];
    // const result = req.body
    // console.log(result);
    const result = await productService.getAll();
    // console.log(result)
    // const test = await productService.findById(result[0]._id)
    let covertJson = JSON.parse(JSON.stringify(result));
    // console.log(covertJson)
    await covertJson.map((value, index) => {
      sheet.addRow({
        name: value.name,
        color: value.color,
        description: value.description,
        inputQuantity: value.inputQuantity,
        inputPrice: value.inputPrice,
        salePrice: value.salePrice,
        warrantyTime: value.warrantyTime,
      });
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment;filename=" + "products.xlsx"
    );
    const aaaa = await workbook.xlsx.write(res);
    res.send(aaaa);
  } catch (error) {
    console.log(error);
  }
};
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
exports.findByIdExportPdf = async (req, res) => {
  try {
    // console.log(req.body.aaa)
    const { aaa } = req.body;
    const result = await productService.findByIdExportPdf(aaa);
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};
exports.findByInputQuantity = async (req, res) => {
  try {
    if (!!req.body.data) {
      const { frommNumber, toNumber } = req.body.data;
      // console.log(req.body.data)
      // console.log(frommNumber, toNumber)
      const products = await productService.getAll();
      let result = [];
      for (const product of products) {
        if (
          product.inputQuantity >= frommNumber &&
          product.inputQuantity <= toNumber
        ) {
          result.push(product);
        }
      }
      // console.log(result)
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
exports.findByInputPrice = async (req, res) => {
  try {
    if (!!req.body.data) {
      const { frommNumber, toNumber } = req.body.data;
      // console.log(req.body.data)
      // console.log(frommNumber, toNumber)
      const products = await productService.getAll();
      let result = [];
      for (const product of products) {
        if (
          product.inputPrice >= frommNumber &&
          product.inputPrice <= toNumber
        ) {
          result.push(product);
        }
      }
      // console.log(result)
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
exports.findBySalePrice = async (req, res) => {
  try {
    if (!!req.body.data) {
      const { frommNumber, toNumber } = req.body.data;
      // console.log(req.body.data)
      // console.log(frommNumber, toNumber)
      const products = await productService.getAll();
      let result = [];
      for (const product of products) {
        if (
          product.salePrice >= frommNumber &&
          product.salePrice <= toNumber
        ) {
          result.push(product);
        }
      }
      // console.log(result)
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
  
  const document = await productService.getAll();
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
exports.getByQuantity = async (req, res) => {
  try {
    const result = await productService.getByQuantity()
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({error})
  }
}