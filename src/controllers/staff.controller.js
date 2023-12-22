import staffService from "../services/staff.service";
import userService from "../services/user.service";
import bcrypt from "bcrypt";
import puppeteer from "puppeteer";
import deepEqual from "deep-equal";

exports.getAll = async (req, res) => {
    try {
        let documents = [];
        // console.log(req.body)
        const pageNumber = req.query.pageNumber ? req.query.pageNumber : {};

        const pageSize = req.query.pageSize ? req.query.pageSize : {};

        const result = await staffService.getAll({}, pageNumber, pageSize);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
};
exports.create = async (req, res) => {
    try {
        console.log(req.body)
        if (req.body) {
            const {
                email,
                phoneNumber,
                password,
                fullName,
                birthday,
                departmentId,
                position,
                dateOfJoin,
                probationaryDate,
                officialDate,
                address,
                personalEmail,
                roles,
                gender,
                academic,
            } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            //create
            const checkEmail = await userService.findByEmail(email);
            const checkPhoneNumber = await userService.findByPhoneNumber(phoneNumber);
            if (checkEmail || checkPhoneNumber) {
                res.json({ mes: "Email đăng nhập hoặc sđt đã tồn tại!", status: false });
                return;
            } else {
                const data = {
                    fullName: fullName,
                    email: email,
                    password: hashed,
                    phoneNumber: phoneNumber,
                    roles: roles,
                    isStaff: true
                };
                const result = await userService.register(data);
                if (result) {
                    const data = {
                        // fullName: fullName,
                        userId: result._id,
                        birthday: birthday,
                        gender: gender,
                        address: address,
                        position: position,
                        academic: academic,
                        departmentId: departmentId,
                        dateOfJoin: dateOfJoin,
                        probationaryDate: probationaryDate,
                        officialDate: officialDate,
                        personalEmail: personalEmail,
                    };
                    const resultStaff = await staffService.create(data);
                    resultStaff
                        ? res.json({ mes: "Thành công", status: true })
                        : res.json({ mes: "Thất bại", status: false });
                } else {
                    res.json({ mes: "Hành động thất bại!" });
                }
            }
        } else {
            res.json({ mes: 'Điền đầy đủ thông tin' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
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
            landscape: true
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
exports.findById = async (req, res) => {
    try {
        if (req.body) {
            const result = await staffService.findById(req.body.id)
            res.json({ result, status: true })
        } else {
            res.json({ mes: "Không tìm thấy nhân viên này!", status: false })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
exports.update = async (req, res) => {
    try {
        // console.log(req.body._id)
        if (req.body) {
            const getStaffById = await staffService.findById(req.body._id)
            if (getStaffById) {
                const OldData = {
                    email: getStaffById.userId.email,
                    phoneNumber: getStaffById.userId.phoneNumber,
                }
                // console.log(OldData)
                const birthday = new Date(`${req.body.birthday}`)
                const dateOfJoin = new Date(`${req.body.dateOfJoin}`)
                const probationaryDate = new Date(`${req.body.probationaryDate}`)
                const officialDate = new Date(`${req.body.officialDate}`)
                const NewData = {
                    email: req.body.userId.email,
                    phoneNumber: req.body.userId.phoneNumber,
                }
                const isEqual = deepEqual(OldData, NewData);
                if(!isEqual) {
                    const checkEmail = await userService.isEmail(req.body.userId._id, req.body.userId.email);
                    const checkPhoneNumber =  await userService.isPhoneNumber(req.body.userId._id, req.body.userId.phoneNumber);
                    // console.log(getUserByEmail, getUserByPhone)
                    if(checkEmail) {
                        res.json({mes: 'Email đã được sử dụng!', status: false})
                    }
                    else if(checkPhoneNumber) {
                        res.json({mes: 'SĐT đã được sử dụng!', status: false});
                    }
                    else {
                        const dataUser = {
                            email: NewData.email,
                            phoneNumber: NewData.phoneNumber,
                            fullName: req.body.userId.fullName,
                            roles: req.body.userId.roles
                        }
                        await userService.update(req.body.userId._id, dataUser)
                        const dataStaff = {
                            birthday: birthday,
                            departmentId: req.body.departmentId._id,
                            position: req.body.position,
                            dateOfJoin: dateOfJoin,
                            probationaryDate: probationaryDate,
                            officialDate: officialDate,
                            address: req.body.address,
                            personalEmail: req.body.personalEmail,
                            gender: req.body.gender,
                            academic: req.body.academic
                        }
                        await staffService.update(req.body._id, dataStaff)
                        res.json({mes: 'Thông tin đã được cập nhật!', status: true})
                        
                    }

                } else {
                    const dataUser = {
                        // email: NewData.email,
                        // phoneNumber: NewData.phoneNumber,
                        fullName: req.body.userId.fullName,
                        roles: req.body.userId.roles
                    }
                    await userService.update(req.body.userId._id, dataUser)
                    const dataStaff = {
                        birthday: birthday,
                        departmentId: req.body.departmentId._id,
                        position: req.body.position,
                        dateOfJoin: dateOfJoin,
                        probationaryDate: probationaryDate,
                        officialDate: officialDate,
                        address: req.body.address,
                        personalEmail: req.body.personalEmail,
                        gender: req.body.gender,
                        academic: req.body.academic
                    }
                    await staffService.update(req.body._id, dataStaff)
                    res.json({mes: 'Thông tin đã được cập nhật!', status: true})
                }
            } else {
                res.json({ mes: 'Không tìm thấy' })
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}
exports.exportPdfDetail = async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        const content = req.body.data;
        // console.log(content)
        await page.setContent(content);
        const blob = await page.pdf({
            format: "A4",
            printBackground: true,
            // landscape: true
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