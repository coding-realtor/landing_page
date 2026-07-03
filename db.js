(function (global) {
  "use strict";

  let _config = null;
  let _configPromise = null;

  function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function decodeBase64(b64) {
    return decodeURIComponent(escape(atob(String(b64).replace(/\s/g, ""))));
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function stripHtml(str) {
    return String(str == null ? "" : str).replace(/<[^>]*>/g, "");
  }

  function renderMarkdown(src) {
    if (src == null) return "";
    var lines = String(src).replace(/\r\n?/g, "\n").split("\n");
    var out = [];
    var i = 0;
    var n = lines.length;

    function esc(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function formatSegment(t) {
      t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, function (m, txt, u) {
        return '<a href="' + u + '" target="_blank" rel="noopener noreferrer" class="text-primary underline">' + txt + "</a>";
      });
      t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      t = t.replace(/~~([^~]+)~~/g, "<del>$1</del>");
      t = t.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
      t = t.replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,!?]|$)/g, "$1<em>$2</em>");
      return t;
    }

    function inline(raw) {
      var s = esc(raw);
      var parts = s.split(/(`[^`]+`)/g);
      var result = "";
      for (var k = 0; k < parts.length; k++) {
        var part = parts[k];
        if (part.length >= 2 && part.charAt(0) === "`" && part.charAt(part.length - 1) === "`") {
          result += '<code class="px-1 py-0.5 rounded bg-surface-container text-secondary text-[0.9em]">' + part.slice(1, -1) + "</code>";
        } else {
          result += formatSegment(part);
        }
      }
      return result;
    }

    var headingClass = {
      1: "text-display-lg font-display-lg text-on-surface mt-6 mb-3",
      2: "text-heading-lg font-heading-md text-on-surface mt-6 mb-2",
      3: "text-heading-md font-heading-md text-on-surface mt-4 mb-2",
      4: "text-body-lg font-heading-md font-bold text-on-surface mt-4 mb-1",
      5: "text-body-lg font-bold text-on-surface mt-3 mb-1",
      6: "text-body-md font-bold text-on-surface mt-3 mb-1"
    };

    function isBlockStart(l) {
      return /^\s*$/.test(l) || /^```/.test(l) || /^#{1,6}\s+/.test(l) ||
        /^\s*>\s?/.test(l) || /^\s*[-*+]\s+/.test(l) || /^\s*\d+\.\s+/.test(l) ||
        /^\s*([-*_])\1\1+\s*$/.test(l);
    }

    while (i < n) {
      var line = lines[i];

      if (/^```/.test(line)) {
        var code = [];
        i++;
        while (i < n && !/^```/.test(lines[i])) { code.push(esc(lines[i])); i++; }
        i++;
        out.push('<pre class="my-3 p-3 rounded-lg bg-surface-container overflow-x-auto text-body-md"><code>' + code.join("\n") + "</code></pre>");
        continue;
      }

      if (/^\s*$/.test(line)) { i++; continue; }

      var h = /^(#{1,6})\s+(.*)$/.exec(line);
      if (h) {
        var lvl = h[1].length;
        out.push("<h" + lvl + ' class="' + headingClass[lvl] + '">' + inline(h[2]) + "</h" + lvl + ">");
        i++; continue;
      }

      if (/^\s*([-*_])\1\1+\s*$/.test(line)) { out.push('<hr class="my-4 border-border">'); i++; continue; }

      if (/^\s*>\s?/.test(line)) {
        var bq = [];
        while (i < n && /^\s*>\s?/.test(lines[i])) { bq.push(inline(lines[i].replace(/^\s*>\s?/, ""))); i++; }
        out.push('<blockquote class="my-3 pl-4 border-l-4 border-secondary-container text-grey-600 italic">' + bq.join("<br>") + "</blockquote>");
        continue;
      }

      if (/^\s*[-*+]\s+/.test(line)) {
        var items = [];
        while (i < n && /^\s*[-*+]\s+/.test(lines[i])) { items.push("<li>" + inline(lines[i].replace(/^\s*[-*+]\s+/, "")) + "</li>"); i++; }
        out.push('<ul class="list-disc pl-6 space-y-1 my-3">' + items.join("") + "</ul>");
        continue;
      }

      if (/^\s*\d+\.\s+/.test(line)) {
        var oitems = [];
        while (i < n && /^\s*\d+\.\s+/.test(lines[i])) { oitems.push("<li>" + inline(lines[i].replace(/^\s*\d+\.\s+/, "")) + "</li>"); i++; }
        out.push('<ol class="list-decimal pl-6 space-y-1 my-3">' + oitems.join("") + "</ol>");
        continue;
      }

      var para = [];
      while (i < n && !isBlockStart(lines[i])) { para.push(inline(lines[i])); i++; }
      out.push('<p class="my-3 leading-relaxed">' + para.join("<br>") + "</p>");
    }

    return out.join("\n");
  }

  function markdownToText(src) {
    var txt = renderMarkdown(src).replace(/<[^>]*>/g, " ");
    txt = txt.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
    return txt.replace(/\s+/g, " ").trim();
  }

  function todayString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "." + m + "." + day;
  }

  async function loadConfig() {
    if (_config) return _config;
    if (_configPromise) return _configPromise;

    _configPromise = (async function () {
      const cfg = {
        githubToken: "",
        adminPassword: "admin1234",
        owner: "",
        repo: "",
        dataFilePath: "data/posts.json"
      };

      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.github_token) cfg.githubToken = String(data.github_token).trim();
          if (data.admin_password) cfg.adminPassword = String(data.admin_password);
        }
      } catch (e) {}

      try {
        const res2 = await fetch("config/git_config.json", { cache: "no-store" });
        if (res2.ok) {
          const gc = await res2.json();
          if (gc.github_owner) cfg.owner = gc.github_owner;
          if (gc.github_repo) cfg.repo = gc.github_repo;
          if (gc.data_file_path) cfg.dataFilePath = gc.data_file_path;
          if (!cfg.githubToken && gc.github_token && gc.github_token !== "YOUR_GITHUB_TOKEN") {
            cfg.githubToken = String(gc.github_token).trim();
          }
        }
      } catch (e) {}

      _config = cfg;
      return cfg;
    })();

    return _configPromise;
  }

  function hasGithub(cfg) {
    return !!(cfg.githubToken && cfg.githubToken !== "YOUR_GITHUB_TOKEN" && cfg.owner && cfg.repo);
  }

  function githubHeaders(cfg) {
    return {
      Authorization: "token " + String(cfg.githubToken).replace(/\s+/g, ""),
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    };
  }

  function contentsUrl(cfg) {
    return "https://api.github.com/repos/" + cfg.owner + "/" + cfg.repo + "/contents/" + cfg.dataFilePath;
  }

  function sortPosts(posts) {
    return (posts || []).slice().sort(function (a, b) {
      return (b.id || 0) - (a.id || 0);
    });
  }

  async function getPosts() {
    const cfg = await loadConfig();

    if (hasGithub(cfg)) {
      try {
        const res = await fetch(contentsUrl(cfg) + "?ref=", {
          headers: githubHeaders(cfg),
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          const json = decodeBase64(data.content);
          const posts = JSON.parse(json || "[]");
          localStorage.setItem("posts_cache", JSON.stringify(posts));
          localStorage.setItem("posts_sha", data.sha);
          return sortPosts(posts);
        }
      } catch (e) {}
    }

    try {
      const res = await fetch(cfg.dataFilePath, { cache: "no-store" });
      if (res.ok) {
        const posts = await res.json();
        localStorage.setItem("posts_cache", JSON.stringify(posts));
        return sortPosts(posts);
      }
    } catch (e) {}

    const cache = localStorage.getItem("posts_cache");
    return cache ? sortPosts(JSON.parse(cache)) : [];
  }

  async function getPost(id) {
    const posts = await getPosts();
    const target = String(id);
    return posts.find(function (p) {
      return String(p.id) === target;
    }) || null;
  }

  async function savePosts(posts, message) {
    const cfg = await loadConfig();

    if (!hasGithub(cfg)) {
      localStorage.setItem("posts_cache", JSON.stringify(posts));
      throw new Error(
        "GitHub 토큰이 설정되지 않았습니다. Vercel 배포 후 환경변수(GITHUB_TOKEN)를 등록하면 정상 저장됩니다."
      );
    }

    let sha = localStorage.getItem("posts_sha") || null;
    try {
      const cur = await fetch(contentsUrl(cfg), {
        headers: githubHeaders(cfg),
        cache: "no-store"
      });
      if (cur.ok) {
        const d = await cur.json();
        sha = d.sha;
      }
    } catch (e) {}

    const body = {
      message: message || "chore: update posts",
      content: encodeBase64(JSON.stringify(posts, null, 2))
    };
    if (sha) body.sha = sha;

    const res = await fetch(contentsUrl(cfg), {
      method: "PUT",
      headers: githubHeaders(cfg),
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      let msg = res.status;
      try {
        const err = await res.json();
        msg = err.message || msg;
      } catch (e) {}
      throw new Error("GitHub 저장 실패: " + msg);
    }

    const result = await res.json();
    localStorage.setItem("posts_sha", result.content.sha);
    localStorage.setItem("posts_cache", JSON.stringify(posts));
    return true;
  }

  async function createPost(post) {
    const posts = await getPosts();
    const newPost = {
      id: Date.now(),
      category: post.category || "소식",
      title: post.title || "",
      content: post.content || "",
      date: post.date || todayString()
    };
    posts.push(newPost);
    await savePosts(posts, "feat: add post - " + newPost.title);
    return newPost;
  }

  async function updatePost(id, data) {
    const posts = await getPosts();
    const target = String(id);
    let updated = null;
    const next = posts.map(function (p) {
      if (String(p.id) === target) {
        updated = Object.assign({}, p, {
          category: data.category != null ? data.category : p.category,
          title: data.title != null ? data.title : p.title,
          content: data.content != null ? data.content : p.content
        });
        return updated;
      }
      return p;
    });
    if (!updated) throw new Error("해당 게시글을 찾을 수 없습니다.");
    await savePosts(next, "fix: update post - " + updated.title);
    return updated;
  }

  async function deletePost(id) {
    const posts = await getPosts();
    const target = String(id);
    const next = posts.filter(function (p) {
      return String(p.id) !== target;
    });
    await savePosts(next, "chore: delete post " + target);
    return true;
  }

  function isAdmin() {
    return sessionStorage.getItem("isAdmin") === "true";
  }

  function loginAdmin() {
    sessionStorage.setItem("isAdmin", "true");
  }

  function logoutAdmin() {
    sessionStorage.removeItem("isAdmin");
  }

  function requireAdmin() {
    if (!isAdmin()) {
      window.location.href = "admin.html";
      return false;
    }
    return true;
  }

  function handleAgentLogin(event) {
    if (event && event.preventDefault) event.preventDefault();
    window.location.href = "admin.html";
  }

  global.DB = {
    loadConfig: loadConfig,
    getPosts: getPosts,
    getPost: getPost,
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost,
    isAdmin: isAdmin,
    loginAdmin: loginAdmin,
    logoutAdmin: logoutAdmin,
    requireAdmin: requireAdmin
  };

  global.loadConfig = loadConfig;
  global.getPosts = getPosts;
  global.getPost = getPost;
  global.createPost = createPost;
  global.updatePost = updatePost;
  global.deletePost = deletePost;
  global.isAdmin = isAdmin;
  global.requireAdmin = requireAdmin;
  global.handleAgentLogin = handleAgentLogin;
  global.escapeHtml = escapeHtml;
  global.stripHtml = stripHtml;
  global.renderMarkdown = renderMarkdown;
  global.markdownToText = markdownToText;
})(window);
