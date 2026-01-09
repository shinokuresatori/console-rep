const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;
const ADMIN_KEY = process.env.ADMIN_KEY;

const DATA_FILE = "data.json";

app.use(express.json());
app.use(express.static("public"));

/* ===== デバッグ（必須）===== */
console.log("ADMIN_KEY loaded:", ADMIN_KEY ? "YES" : "NO");

/* ===== DDS Viewer ===== */
app.get("/dds", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "index.html"));
});

/* ===== admin login API ===== */
app.post("/dds/api/admin-login", (req, res) => {
  if (!ADMIN_KEY) {
    return res.status(500).json({ ok: false });
  }

  const { key } = req.body;
  res.json({ ok: key === ADMIN_KEY });
});

/* ===== データ保存 ===== */
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

/* ===== データ取得 ===== */
app.get("/dds/api/data", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json({});
  res.json(JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
});

/* ===== admin pages ===== */
app.get("/dds/admin-lock.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "admin-lock.html"));
});

app.get("/dds/admin-panel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "admin-panel.html"));
});

/* ===== fallback ===== */
app.get("/dds/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "index.html"));
});

app.listen(PORT, () => {
  console.log("DDS Server running on", PORT);
});
