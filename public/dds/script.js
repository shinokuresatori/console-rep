(() => {
  const app = document.getElementById("app");

  const routes = [
    {
      match: /^\/dds\/?$/,
      file: "/dds/index.html"
    },
    {
      match: /^\/dds\/admin$/,
      file: "/dds/admin-panel.html"
    },
    {
      match: /^\/dds\/admin-lock$/,
      file: "/dds/admin-lock.html"
    },
    {
      match: /^\/dds\/bVgr6sSX8uJpcMJ$/,
      file: "/dds/bVgr6sSX8uJpcMJ.html"
    }
  ];

  async function render() {
    const path = location.pathname;

    const route = routes.find(r => r.match.test(path));
    if (!route) {
      show404();
      return;
    }

    try {
      const res = await fetch(route.file, { cache: "no-store" });
      if (!res.ok) throw new Error("load error");

      const html = await res.text();
      app.innerHTML = html;
    } catch {
      show404();
    }
  }

  function show404() {
    app.innerHTML = `
      <h2>NO RECORD</h2>
      <p>記録は標示されていないようです。</p>
    `;
  }

  // 戻る・進む対応
  window.addEventListener("popstate", render);

  // 初回表示
  render();
})();
