const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

const ADMIN_PASSWORD = "shinokure_satori_ryouko_shinohara";

app.use(express.static("public"));

/* ===== admin login (GET) ===== */
app.get("/dds/api/admin-login", (req, res) => {
  const password = req.query.password;
  res.json({ ok: password === ADMIN_PASSWORD });
});

/* ===== admin pages ===== */
app.get("/dds/admin-lock.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dds/admin-lock.html"));
});

app.get("/dds/admin-panel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dds/admin-panel.html"));
});

/* ===== fallback ===== */
app.get("/dds/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dds/index.html"));
});

app.listen(PORT, () => {
  console.log("DDS Server running on", PORT);
});
