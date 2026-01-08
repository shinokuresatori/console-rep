const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;
const ADMIN_KEY = process.env.ADMIN_KEY;

const DATA_FILE  = "data.json";       // 日付ログ
const STATE_FILE = "dds-state.json";  // ARG状態

app.use(express.json());
app.use(express.static("public"));

/* ===== DDS Viewer ===== */
app.get("/dds", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "index.html"));
});

/* ===== 調査の手引き ===== */
app.get("/dds/instruction", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "bVgr6sSX8uJpcMJ.html"));
});

/* ===== admin ログイン ===== */
app.post("/dds/api/admin-login", (req, res) => {
  const { key } = req.body;
  if (!ADMIN_KEY) {
    return res.status(500).json({ error: "ADMIN_KEY not set" });
  }
  res.json({ ok: key === ADMIN_KEY });
});

/* ===== 日付データ保存（■付与はサーバー側） ===== */
app.post("/dds/api/save", (req, res) => {
  const { date, detail } = req.body;
  if (!date || !detail) {
    return res.status(400).json({ error: "Invalid data" });
  }

  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  }

  data[date] = "■" + detail;

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

/* ===== 日付データ取得 ===== */
app.get("/dds/api/data", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json({});
  res.json(JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
});

/* ===== ARG 状態取得 ===== */
app.get("/dds/api/state", (req, res) => {
  if (!fs.existsSync(STATE_FILE)) return res.json({});
  res.json(JSON.parse(fs.readFileSync(STATE_FILE, "utf8")));
});

/* ===== ARG 状態更新 ===== */
app.post("/dds/api/state", (req, res) => {
  const { id, state } = req.body;
  if (!id || !state) {
    return res.status(400).json({ error: "Invalid state data" });
  }

  let s = {};
  if (fs.existsSync(STATE_FILE)) {
    s = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  }

  s[id] = state;
  fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));
  res.json({ ok: true });
});

/* ===== admin HTML 明示 ===== */
app.get("/dds/admin-lock.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "admin-lock.html"));
});

app.get("/dds/admin-panel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "admin-panel.html"));
});

/* ===== 直打ち対策（最後！） ===== */
app.get("/dds/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "index.html"));
});

app.listen(PORT, () => {
  console.log("DDS Server running:", PORT);
});
