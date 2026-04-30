const request = require("supertest");
const app = require("../app");
const sql = require("../config/db");

describe("Phiếu nhập kho", () => {
    const soPhieuTest = "PN_TEST_001";

    afterAll(async () => {
        await sql`
            DELETE FROM chi_tiet_phieu_nhap
            WHERE so_phieu = ${soPhieuTest}
        `;

        await sql`
            DELETE FROM phieu_nhap_kho
            WHERE so_phieu = ${soPhieuTest}
        `;

        await sql.end();
    });

    test("GET /phieu-nhap trả về danh sách phiếu nhập", async () => {
        const res = await request(app).get("/phieu-nhap");

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Danh sách phiếu nhập kho");
    });

    test("GET /phieu-nhap/add trả về form thêm phiếu", async () => {
        const res = await request(app).get("/phieu-nhap/add");

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Thêm phiếu nhập kho");
    });

    test("POST /phieu-nhap/add thiếu dữ liệu thì redirect về form", async () => {
        const res = await request(app).post("/phieu-nhap/add").send({});

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe("/phieu-nhap/add");
    });

    test("POST /phieu-nhap/add thêm phiếu nhập thành công", async () => {
        const res = await request(app)
            .post("/phieu-nhap/add")
            .type("form")
            .send({
                so_phieu: soPhieuTest,
                ngay_lap_phieu: "2026-04-30",
                ma_don_vi: "DV001",
                ma_bo_phan: "BP001",
                ma_tai_khoan_no: "152",
                ma_tai_khoan_co: "331",
                so_chung_tu: "HD_TEST",
                ngay_chung_tu: "2026-04-30",
                ma_kho: "K001",
                so_chung_tu_goc_kem_theo: "Hóa đơn test",
                ma_nguoi_lap_phieu: "NV001",
                ten_nguoi_giao_hang: "Người giao test",
                ma_thu_kho: "NV002",
                ma_ke_toan_truong: "NV003",
                "chi_tiet[0][ma_vat_tu]": "VT001",
                "chi_tiet[0][so_luong_theo_chung_tu]": "10",
                "chi_tiet[0][so_luong_thuc_nhap]": "10",
                "chi_tiet[0][don_gia]": "10000",
            });

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe("/phieu-nhap");
    });

    test("GET /phieu-nhap/:so_phieu xem chi tiết phiếu", async () => {
        const res = await request(app).get(`/phieu-nhap/${soPhieuTest}`);

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("PHIẾU NHẬP KHO");
        expect(res.text).toContain(soPhieuTest);
    });
});
