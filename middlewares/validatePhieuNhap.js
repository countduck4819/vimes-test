const validatePhieuNhap = (req, res, next) => {
    const data = req.body;

    if (!data.so_phieu) {
        req.flash("error", "Vui lòng nhập số phiếu");
        return res.redirect("/phieu-nhap/add");
    }

    if (!data.ngay_lap_phieu) {
        req.flash("error", "Vui lòng chọn ngày lập phiếu");
        return res.redirect("/phieu-nhap/add");
    }

    if (!data.ma_don_vi) {
        req.flash("error", "Vui lòng chọn đơn vị");
        return res.redirect("/phieu-nhap/add");
    }

    if (!data.ma_bo_phan) {
        req.flash("error", "Vui lòng chọn bộ phận");
        return res.redirect("/phieu-nhap/add");
    }

    if (!data.ma_kho) {
        req.flash("error", "Vui lòng chọn kho nhập");
        return res.redirect("/phieu-nhap/add");
    }

    if (!data.ten_nguoi_giao_hang) {
        req.flash("error", "Vui lòng nhập tên người giao hàng");
        return res.redirect("/phieu-nhap/add");
    }

    if (!data.ma_nguoi_lap_phieu) {
        req.flash("error", "Vui lòng chọn người lập phiếu");
        return res.redirect("/phieu-nhap/add");
    }

    if (!data.ma_thu_kho) {
        req.flash("error", "Vui lòng chọn thủ kho");
        return res.redirect("/phieu-nhap/add");
    }

    if (!data.ma_ke_toan_truong) {
        req.flash("error", "Vui lòng chọn kế toán trưởng");
        return res.redirect("/phieu-nhap/add");
    }

    if (!data.chi_tiet) {
        req.flash("error", "Vui lòng nhập ít nhất một dòng vật tư");
        return res.redirect("/phieu-nhap/add");
    }

    let chiTiet = data.chi_tiet;

    if (!Array.isArray(chiTiet)) {
        chiTiet = [chiTiet];
    }

    for (let i = 0; i < chiTiet.length; i++) {
        const item = chiTiet[i];

        if (!item.ma_vat_tu) {
            req.flash("error", `Dòng ${i + 1}: vui lòng chọn vật tư`);
            return res.redirect("/phieu-nhap/add");
        }

        if (!item.so_luong_thuc_nhap || Number(item.so_luong_thuc_nhap) <= 0) {
            req.flash(
                "error",
                `Dòng ${i + 1}: số lượng thực nhập không hợp lệ`,
            );
            return res.redirect("/phieu-nhap/add");
        }

        if (!item.don_gia || Number(item.don_gia) <= 0) {
            req.flash("error", `Dòng ${i + 1}: đơn giá không hợp lệ`);
            return res.redirect("/phieu-nhap/add");
        }
    }

    next();
};

module.exports = validatePhieuNhap;
