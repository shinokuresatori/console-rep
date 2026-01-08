(() => {
  const app = document.getElementById("app");

  // ルート定義
  const routes = {
    "/dds": "/dds/views/home.html",
    "/dds/": "/dds/views/home.html",
    "/dds/admin": "/dds/views/admin.html",
    "/dds/admin-lock": "/dds/views/admin-lock.html",
    "/dds/guide": "/dds/views/guide.html"
  };

  // HTML読み込み
  async function loadView(path) {
    const view = routes[path];

    if (!view) {
      show404();
      return;
    }

    try {
      const res = await fetch(view, { cache: "no-store" });
      if (!res.ok) throw new Error("load failed");

      const html = await res.text();
      app.innerHTML = html;

      bindLinks(); // 内部リンク再バインド
    } catch {
      show404();
    }
  }

  // 内部リンク制御（.html封印）
  function bindLinks() {
    document.querySelectorAll("a").forEach(a => {
      const href = a.getAttribute("href");
      if (!href) return;

      if (href.startsWith("/dds")) {
        a.addEventListener("click", e => {
          e.preventDefault();
          history.pushState(null, "", href);
          loadView(location.pathname);
        });
      }
    });
  }

  // 404演出（ARG向け）
  function show404() {
    app.innerHTML = `
      <h2>NO RECORD</h2>
      <p>記録は標示されていないようです。</p>
    `;
  }

  // 戻る・進む対応
  window.addEventListener("popstate", () => {
    loadView(location.pathname);
  });

  // 初期ロード
  loadView(location.pathname);
})();
