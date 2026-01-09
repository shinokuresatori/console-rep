const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

/* ===== 固定パスワード（ここだけ変更すればOK） ===== */
const ADMIN_PASSWORD = "shinokure_satori_ryouko_shinohara";

app.use(express.json());
app.use(express.static("public"));

/* ===== admin login API ===== */
app.post("/dds/api/admin-login", (req, res) => {
  const { password } = req.body;
  res.json({ ok: password === ADMIN_PASSWORD });
});

/* ===== admin pages ===== */
app.get("/dds/admin-lock.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "admin-lock.html"));
});

app.get("/dds/admin-panel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "admin-panel.html"));
});

/* ===== DDS viewer ===== */
app.get("/dds/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dds", "index.html"));
});

app.listen(PORT, () => {
  console.log("DDS Server running on", PORT);
});
