var express = require("express");
var router = express.Router();
const sql = require("../config/db");

router.get("/", async function (req, res, next) {
    res.render("index", { title: "Express" });
});

module.exports = router;
