const phieuNhapModel = require("../models/phieuNhap");

const phieuNhapController = {
    index: async (req, res) => {
        try {
            const phieuNhaps = await phieuNhapModel.getAll();

            res.render("phieu-nhap/index", {
                phieuNhaps,
                msg: req.flash("msg"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.log(error);
            res.send("Lỗi lấy danh sách phiếu nhập");
        }
    },

    add: async (req, res) => {
        try {
            const data = await phieuNhapModel.getFormData();

            res.render("phieu-nhap/add", {
                donVis: data.donVis,
                boPhans: data.boPhans,
                taiKhoans: data.taiKhoans,
                nguoiLapPhieus: data.nguoiLapPhieus,
                thuKhos: data.thuKhos,
                keToanTruongs: data.keToanTruongs,
                khos: data.khos,
                vatTus: data.vatTus,
                error: req.flash("error"),
            });
        } catch (error) {
            console.log(error);
            res.send("Lỗi mở form thêm phiếu nhập");
        }
    },

    handleAdd: async (req, res) => {
        try {
            await phieuNhapModel.create(req.body);

            req.flash("msg", "Thêm phiếu nhập kho thành công");

            return res.redirect("/phieu-nhap");
        } catch (error) {
            console.log(error);

            if (error.code === "23505") {
                req.flash("error", "Số phiếu đã tồn tại");
            } else {
                req.flash("error", "Không thể thêm phiếu nhập kho");
            }

            return res.redirect("/phieu-nhap/add");
        }
    },

    detail: async (req, res) => {
        try {
            const soPhieu = req.params.so_phieu;
            const data = await phieuNhapModel.getDetail(soPhieu);

            if (!data.phieu) {
                return res.send("Không tìm thấy phiếu nhập kho");
            }

            res.render("phieu-nhap/detail", {
                phieu: data.phieu,
                chiTiet: data.chiTiet,
            });
        } catch (error) {
            console.log(error);
            res.send("Lỗi lấy chi tiết phiếu nhập");
        }
    },
};

module.exports = phieuNhapController;
