const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;
const ADMIN_KEY = process.env.ADMIN_KEY; // 環境変数に設定

const DATA_FILE = "data.json";       // 日付ログ
const STATE_FILE = "dds-state.json"; // ARG状態

app.use(express.json());
app.use(express.static("public"));

// ===== DDS Viewer =====
app.get("/dds", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "index.html"));
});

// ===== 調査の手引き =====
app.get("/dds/instruction", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "bVgr6sSX8uJpcMJ.html"));
});

// ===== ADMIN LOGIN =====
app.post("/dds/api/admin-login", (req, res) => {
  const { key } = req.body;
  if (!ADMIN_KEY) return res.status(500).json({ error: "ADMIN_KEY not set" });
  res.json({ ok: key === ADMIN_KEY });
});

// ===== SAVE DATA =====
app.post("/dds/api/save", (req, res) => {
  const { date, detail } = req.body;
  if (!date || !detail) return res.status(400).json({ error: "Invalid data" });

  let data = {};
  if (fs.existsSync(DATA_FILE)) data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

  // 必ず■を付与して保存
  data[date] = "■ " + detail;

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

// ===== GET DATA =====
app.get("/dds/api/data", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json({});
  res.json(JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
});

// ===== ARG STATE =====
app.get("/dds/api/state", (req, res) => {
  if (!fs.existsSync(STATE_FILE)) return res.json({});
  res.json(JSON.parse(fs.readFileSync(STATE_FILE, "utf8")));
});

app.post("/dds/api/state", (req, res) => {
  const { id, state } = req.body;
  if (!id || !state) return res.status(400).json({ error: "Invalid state data" });

  let s = {};
  if (fs.existsSync(STATE_FILE)) s = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));

  s[id] = state; // investigating / completed
  fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));
  res.json({ ok: true });
});

// ===== ADMIN HTML =====
app.post("/dds/api/admin-login", (req, res) => {
  const { key } = req.body;

  // 安全に環境変数を確認
  if (!process.env.ADMIN_KEY || process.env.ADMIN_KEY.trim() === "") {
    console.error("ADMIN_KEY is not set!");
    return res.status(500).json({ error: "ADMIN_KEY not set" });
  }

  const adminKey = process.env.ADMIN_KEY.trim();
  res.json({ ok: key === adminKey });
});
app.get("/dds/admin-panel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "admin-panel.html"));
});

// ===== DDS 直打ち対策 =====
app.get("/dds/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "index.html"));
});

app.listen(PORT, () => console.log("DDS Server running on port", PORT));
