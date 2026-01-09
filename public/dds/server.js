<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>ADMIN LOCK</title>
<style>
body{
  background:#000;
  color:#ccc;
  font-family:Consolas,monospace;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}
.container{width:260px}
input,button{
  width:100%;
  margin-top:8px;
  background:#000;
  border:1px solid #444;
  color:#ccc;
  padding:6px;
}
#msg{margin-top:8px;color:#888}
</style>
</head>
<body>

<div class="container">
  <h3>ADMIN ACCESS</h3>
  <input id="password" type="password" placeholder="PASSWORD"
    onkeydown="if(event.key==='Enter') login()">
  <button onclick="login()">ENTER</button>
  <div id="msg"></div>
</div>

<script>
function login(){
  const pw = document.getElementById("password").value;
  const msg = document.getElementById("msg");
  msg.textContent = "";

  fetch("/dds/api/admin-login",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ password: pw })   // ★ここ重要
  })
  .then(r => r.json())
  .then(d => {
    if(d.ok){
      localStorage.setItem("dds_admin_signal","1");
      location.href = "/dds/admin-panel.html";
    }else{
      msg.textContent = "ACCESS DENIED";
    }
  })
  .catch(()=>{
    msg.textContent = "SERVER ERROR";
  });
}
</script>

</body>
</html>
