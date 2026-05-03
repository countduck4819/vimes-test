const test = require("node:test");
const assert = require("node:assert");
const app = require("../app");
const sql = require("../config/db");

const soPhieuTest = "PN_TEST_001";

const { PORT_TEST: PORT, BASE_URL } = require("../config/const");
let server;

test.before(() => {
    server = app.listen(PORT);
});

test.after(async () => {
    try {
        await sql`DELETE FROM chi_tiet_phieu_nhap WHERE so_phieu = ${soPhieuTest}`;
        await sql`DELETE FROM phieu_nhap_kho WHERE so_phieu = ${soPhieuTest}`;
    } finally {
        await sql.end();

        await new Promise((resolve) => {
            server.close(resolve);
        });
    }
});

test("GET /phieu-nhap trả về danh sách phiếu nhập", async () => {
    const res = await fetch(`${BASE_URL}/phieu-nhap`);

    assert.strictEqual(res.status, 200);

    const text = await res.text();
    assert.match(text, /Danh sách phiếu nhập kho/);
});

test("GET /phieu-nhap/add trả về form thêm phiếu", async () => {
    const res = await fetch(`${BASE_URL}/phieu-nhap/add`);

    assert.strictEqual(res.status, 200);

    const text = await res.text();
    assert.match(text, /Thêm phiếu nhập kho/);
});

test("POST /phieu-nhap/add thiếu dữ liệu thì redirect về form", async () => {
    const res = await fetch(`${BASE_URL}/phieu-nhap/add`, {
        method: "POST",
        redirect: "manual",
        body: new URLSearchParams({}),
    });

    assert.strictEqual(res.status, 302);
    assert.strictEqual(res.headers.get("location"), "/phieu-nhap/add");
});

test("POST /phieu-nhap/add thêm phiếu nhập thành công", async () => {
    const res = await fetch(`${BASE_URL}/phieu-nhap/add`, {
        method: "POST",
        redirect: "manual",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
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
        }),
    });

    assert.strictEqual(res.status, 302);
    assert.strictEqual(res.headers.get("location"), "/phieu-nhap");
});

test("GET /phieu-nhap/:so_phieu xem chi tiết phiếu", async () => {
    const res = await fetch(`${BASE_URL}/phieu-nhap/${soPhieuTest}`);

    assert.strictEqual(res.status, 200);

    const text = await res.text();
    assert.match(text, /PHIẾU NHẬP KHO/);
    assert.match(text, new RegExp(soPhieuTest));
});
