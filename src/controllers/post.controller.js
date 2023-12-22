import postService from "../services/post.service";
import deepEqual from "deep-equal";
import puppeteer from "puppeteer";

exports.create = async (req, res) => {
    try {
        if(!!req.body) {
            // console.log(req.body.name)
            const userCreate = req.session.auth
            const { title, ListDes } = req.body;
            const image = req.file? req.file.path.split('uploads')[1].replace(/\\/g, '/') : ''
            const data = {
              title: title,
              userId: userCreate.user._id,
              descriptions: ListDes,
              image: image
            }
            await postService.create(data);
            res.send({mes: 'Thêm thành công!', status: true})
        }
        else {
            res.json({mes: 'Vui lòng nhập đầy đủ thông tin!', status: false})
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
        const result = await postService.getAll({}, pageNumber, pageSize);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.update = async (req, res) => {
    try {   
        // console.log(req.body);
        const getPost = await postService.findById(req.body._id)
        // console.log(getPost)
        const image =  req.file? req.file.path.split('uploads')[1].replace(/\\/g, '/') : getPost.image
        
        const data = {
            title: req.body.title,
            descriptions: req.body.descriptions,
            image: image
        }
        
          const result = await postService.update(req.body._id, data);
          if(result) {
              res.json({result, mes: 'Cập nhật thành công', status: true})
          } else {
            res.json({mes: 'cập nhật thất bại'})
          }
        
    } catch(error) {
        // console.log(error)
        console.log(error)
        res.status(500).json({error});
    }
}

exports.findById = async (req, res) => {
    try {   
        // console.log(req.body)
        const {id} = req.body
        const result = await postService.findById(id)
        res.json(result)
    } catch(error) {
        console.log(error) 
        res.status(500).json({error})
    }
}
exports.delete = async (req, res) => {
    try {
        const {id} = req.body
        await postService.delete(id)
        res.json({mes:'Xóa thành công!'})
    }catch (error) {
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
  exports.findByDate = async (req, res) => {
    try {
        const document = await postService.getAll();
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
            } 
        }
        } else {
        res.json({mes: "Chưa tìm kiếm!"})
        }
        res.json({result})
    } catch(error) {
        console.log(error)
        res.status(500).json({error})
    }
    
  };
  