const sql = require("../config/db");

const phieuNhapModel = {
    getFormData: async () => {
        const donVis = await sql`
      SELECT * FROM don_vi 
      WHERE deleted_at IS NULL
    `;

        const boPhans = await sql`
      SELECT * FROM bo_phan 
      WHERE deleted_at IS NULL
    `;

        const taiKhoans = await sql`
      SELECT * FROM tai_khoan 
      WHERE deleted_at IS NULL
    `;

        const nguoiLapPhieus = await sql`
  SELECT nhan_vien.*
  FROM nhan_vien
  INNER JOIN vi_tri 
    ON nhan_vien.ma_vi_tri = vi_tri.ma_vi_tri
  WHERE nhan_vien.deleted_at IS NULL
`;

        const thuKhos = await sql`
  SELECT nhan_vien.*
  FROM nhan_vien
  INNER JOIN vi_tri 
    ON nhan_vien.ma_vi_tri = vi_tri.ma_vi_tri
  WHERE vi_tri.ten_vi_tri = 'Thủ kho'
  AND nhan_vien.deleted_at IS NULL
`;

        const keToanTruongs = await sql`
  SELECT nhan_vien.*
  FROM nhan_vien
  INNER JOIN vi_tri 
    ON nhan_vien.ma_vi_tri = vi_tri.ma_vi_tri
  WHERE vi_tri.ten_vi_tri = 'Kế toán trưởng'
  AND nhan_vien.deleted_at IS NULL
`;

        const khos = await sql`
      SELECT * FROM kho 
      WHERE deleted_at IS NULL
    `;

        const vatTus = await sql`
      SELECT 
        vat_tu.*,
        don_vi_tinh.ten_don_vi_tinh
      FROM vat_tu
      INNER JOIN don_vi_tinh ON vat_tu.ma_don_vi_tinh = don_vi_tinh.ma_don_vi_tinh
      WHERE vat_tu.deleted_at IS NULL
    `;

        return {
            donVis,
            boPhans,
            taiKhoans,
            nguoiLapPhieus,
            thuKhos,
            keToanTruongs,
            khos,
            vatTus,
        };
    },
    getAll: async () => {
        const phieuNhaps = await sql`
      SELECT 
        phieu_nhap_kho.so_phieu,
        phieu_nhap_kho.ngay_lap_phieu,
        phieu_nhap_kho.ten_nguoi_giao_hang,
        don_vi.ten_don_vi,
        bo_phan.ten_bo_phan,
        kho.ten_kho,
        nhan_vien.ho_ten_nhan_vien AS nguoi_lap_phieu
      FROM phieu_nhap_kho
      INNER JOIN don_vi ON phieu_nhap_kho.ma_don_vi = don_vi.ma_don_vi
      INNER JOIN bo_phan ON phieu_nhap_kho.ma_bo_phan = bo_phan.ma_bo_phan
      INNER JOIN kho ON phieu_nhap_kho.ma_kho = kho.ma_kho
      INNER JOIN nhan_vien ON phieu_nhap_kho.ma_nguoi_lap_phieu = nhan_vien.ma_nhan_vien
      WHERE phieu_nhap_kho.deleted_at IS NULL
      ORDER BY phieu_nhap_kho.ngay_lap_phieu DESC
    `;

        for (let i = 0; i < phieuNhaps.length; i++) {
            const chiTiet = await sql`
        SELECT * FROM chi_tiet_phieu_nhap
        WHERE so_phieu = ${phieuNhaps[i].so_phieu}
        AND deleted_at IS NULL
      `;

            let tongTien = 0;

            for (let j = 0; j < chiTiet.length; j++) {
                const soLuong = Number(chiTiet[j].so_luong_thuc_nhap);
                const donGia = Number(chiTiet[j].don_gia);

                tongTien = tongTien + soLuong * donGia;
            }

            phieuNhaps[i].tong_tien = tongTien;
        }

        return phieuNhaps;
    },
    getDetail: async (soPhieu) => {
        const phieu = await sql`
      SELECT 
        phieu_nhap_kho.*,
        don_vi.ten_don_vi,
        bo_phan.ten_bo_phan,
        kho.ten_kho,
        kho.dia_diem_kho,
        tai_khoan_no.ten_tai_khoan AS ten_tai_khoan_no,
        tai_khoan_co.ten_tai_khoan AS ten_tai_khoan_co,
        nguoi_lap.ho_ten_nhan_vien AS nguoi_lap_phieu,
        thu_kho.ho_ten_nhan_vien AS thu_kho,
        ke_toan.ho_ten_nhan_vien AS ke_toan_truong
      FROM phieu_nhap_kho
      INNER JOIN don_vi ON phieu_nhap_kho.ma_don_vi = don_vi.ma_don_vi
      INNER JOIN bo_phan ON phieu_nhap_kho.ma_bo_phan = bo_phan.ma_bo_phan
      INNER JOIN kho ON phieu_nhap_kho.ma_kho = kho.ma_kho
      INNER JOIN tai_khoan AS tai_khoan_no ON phieu_nhap_kho.ma_tai_khoan_no = tai_khoan_no.ma_tai_khoan
      INNER JOIN tai_khoan AS tai_khoan_co ON phieu_nhap_kho.ma_tai_khoan_co = tai_khoan_co.ma_tai_khoan
      INNER JOIN nhan_vien AS nguoi_lap ON phieu_nhap_kho.ma_nguoi_lap_phieu = nguoi_lap.ma_nhan_vien
      INNER JOIN nhan_vien AS thu_kho ON phieu_nhap_kho.ma_thu_kho = thu_kho.ma_nhan_vien
      INNER JOIN nhan_vien AS ke_toan ON phieu_nhap_kho.ma_ke_toan_truong = ke_toan.ma_nhan_vien
      WHERE phieu_nhap_kho.so_phieu = ${soPhieu}
      AND phieu_nhap_kho.deleted_at IS NULL
    `;

        const chiTiet = await sql`
      SELECT 
        chi_tiet_phieu_nhap.*,
        vat_tu.ten_vat_tu,
        vat_tu.nhan_hieu_vat_tu,
        vat_tu.quy_cach_vat_tu,
        vat_tu.pham_chat_vat_tu,
        don_vi_tinh.ten_don_vi_tinh
      FROM chi_tiet_phieu_nhap
      INNER JOIN vat_tu ON chi_tiet_phieu_nhap.ma_vat_tu = vat_tu.ma_vat_tu
      INNER JOIN don_vi_tinh ON vat_tu.ma_don_vi_tinh = don_vi_tinh.ma_don_vi_tinh
      WHERE chi_tiet_phieu_nhap.so_phieu = ${soPhieu}
      AND chi_tiet_phieu_nhap.deleted_at IS NULL
    `;

        for (let i = 0; i < chiTiet.length; i++) {
            chiTiet[i].thanh_tien =
                Number(chiTiet[i].so_luong_thuc_nhap) *
                Number(chiTiet[i].don_gia);
        }

        return {
            phieu: phieu[0],
            chiTiet,
        };
    },
    create: async (data) => {
        try {
            await sql`
      INSERT INTO phieu_nhap_kho (
        so_phieu,
        ngay_lap_phieu,
        ma_don_vi,
        ma_bo_phan,
        ma_tai_khoan_no,
        ma_tai_khoan_co,
        so_chung_tu,
        ngay_chung_tu,
        ma_kho,
        so_chung_tu_goc_kem_theo,
        ma_nguoi_lap_phieu,
        ten_nguoi_giao_hang,
        ma_thu_kho,
        ma_ke_toan_truong
      )
      VALUES (
        ${data.so_phieu},
        ${data.ngay_lap_phieu},
        ${data.ma_don_vi},
        ${data.ma_bo_phan},
        ${data.ma_tai_khoan_no},
        ${data.ma_tai_khoan_co},
        ${data.so_chung_tu || null},
        ${data.ngay_chung_tu || null},
        ${data.ma_kho},
        ${data.so_chung_tu_goc_kem_theo || null},
        ${data.ma_nguoi_lap_phieu},
        ${data.ten_nguoi_giao_hang},
        ${data.ma_thu_kho},
        ${data.ma_ke_toan_truong}
      )
    `;

            let chiTiet = data.chi_tiet;

            if (!Array.isArray(chiTiet)) {
                chiTiet = [chiTiet];
            }

            for (let i = 0; i < chiTiet.length; i++) {
                const item = chiTiet[i];

                await sql`
        INSERT INTO chi_tiet_phieu_nhap (
          so_phieu,
          ma_vat_tu,
          so_luong_theo_chung_tu,
          so_luong_thuc_nhap,
          don_gia
        )
        VALUES (
          ${data.so_phieu},
          ${item.ma_vat_tu},
          ${item.so_luong_theo_chung_tu || 0},
          ${item.so_luong_thuc_nhap},
          ${item.don_gia}
        )
      `;
            }
        } catch (error) {
            await sql`
      DELETE FROM chi_tiet_phieu_nhap
      WHERE so_phieu = ${data.so_phieu}
    `;

            await sql`
      DELETE FROM phieu_nhap_kho
      WHERE so_phieu = ${data.so_phieu}
    `;

            throw error;
        }
    },
};

module.exports = phieuNhapModel;
