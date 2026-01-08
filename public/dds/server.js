const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;
const ADMIN_KEY = process.env.ADMIN_KEY;
const DATA_FILE = "data.json";

app.use(express.json());
app.use(express.static("public"));

// ===== DDS Viewer =====
app.get("/dds", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "viewer.html"));
});

// ===== 調査の手引き =====
app.get("/dds/instruction", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "bVgr6sSX8uJpcMJ.html")
  );
});

// ===== admin ログイン =====
app.post("/dds/api/admin-login", (req, res) => {
  const { key } = req.body;
  if (!ADMIN_KEY) return res.status(500).json({ error: "ADMIN_KEY not set" });
  res.json({ ok: key === ADMIN_KEY });
});

// ===== データ保存 =====
app.post("/dds/api/save", (req, res) => {
  const { date, detail } = req.body;
  if (!date || !detail) return res.status(400).json({ error: "Invalid data" });

  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  }

  data[date] = detail;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

// ===== データ取得 =====
app.get("/dds/api/data", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json({});
  res.json(JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
});

// ===== 直打ち対策 =====
app.get("/dds/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "viewer.html"));
});

app.listen(PORT, () => {
  console.log("DDS Server running:", PORT);
});
