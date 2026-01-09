const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;

/* ===== 固定ADMINパスワード ===== */
const ADMIN_PASSWORD = "shinokure_satori_ryouko_shinohara";

/* ===== 保存ファイル ===== */
const DATA_FILE = path.join(__dirname, "data.json");

/* ===== middleware ===== */
app.use(express.json());
app.use(express.static("public"));

/* =====================================================
   DDS VIEWER
===================================================== */
app.get("/dds", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "index.html"));
});

/* =====================================================
   ADMIN LOGIN API
===================================================== */
app.post("/dds/api/admin-login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.json({ ok: false });
  }

  res.json({ ok: password === ADMIN_PASSWORD });
});

/* =====================================================
   DDS DATA SAVE
===================================================== */
app.post("/dds/api/save", (req, res) => {
  const { date, detail } = req.body;

  if (!date || !detail) {
    return res.status(400).json({ ok: false });
  }

  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  }

  data[date] = detail;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ ok: true });
});

/* =====================================================
   DDS DATA LOAD
===================================================== */
app.get("/dds/api/data", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json({});
  }
  res.json(JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
});

/* =====================================================
   ADMIN PAGES
===================================================== */
app.get("/dds/admin-lock.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "admin-lock.html"));
});

app.get("/dds/admin-panel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "admin-panel.html"));
});

/* =====================================================
   FALLBACK（DDS配下）
===================================================== */
app.get("/dds/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "index.html"));
});

/* =====================================================
   START
===================================================== */
app.listen(PORT, () => {
  console.log("DDS Server running on", PORT);
});
