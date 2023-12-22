import recruitmentService from "../services/recruitment.service";
import deepEqual from "deep-equal";
import puppeteer from "puppeteer";

exports.create = async (req, res) => {
    try {
        const userCreate = req.session.auth
        if(userCreate) {
            if(!!req.body) {
                const { position, experience, professionalTasks, togetherTask } = req.body;
                const data = {
                  position: position,
                  userId: userCreate.user._id,
                  experience: experience,
                  professionalTasks: professionalTasks,
                  togetherTask: togetherTask,
                }
                const result = await recruitmentService.create(data);
                if(result) {
                    res.send({result, mes: 'Thêm thành công!', status: true})
                } else {
                    res.json({mes: 'Lỗi!', status: false})
                }
            }
            else {
                res.json({mes: 'Vui lòng nhập đầy đủ thông tin!', status: false})
            }
        } else {
            res.json({mes: 'Bạn chưa đăng nhập!'})
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
        const result = await recruitmentService.getAll({}, pageNumber, pageSize);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
}

exports.update = async (req, res) => {
    try {   
        const Newdata = {
            position: req.body.position,
            experience: req.body.experience,
            professionalTasks: req.body.professionalTasks,
            togetherTask: req.body.togetherTask,
        }
        const result = await recruitmentService.update(req.body._id, Newdata);
        if(result) {
            res.json({result, mes: 'Cập nhật thành công', status: true})
        } else {
        res.json({mes: 'cập nhật thất bại', status: false})
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
        const result = await recruitmentService.findById(id)
        res.json(result)
    } catch(error) {
        console.log(error) 
        res.status(500).json({error})
    }
}
exports.delete = async (req, res) => {
    try {
        const {id} = req.body
        await recruitmentService.delete(id)
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
        const document = await recruitmentService.getAll();
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
  