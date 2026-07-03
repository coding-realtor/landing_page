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
        dataFilePath: "public/data/posts.json"
      };

      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.github_token) cfg.githubToken = data.github_token;
          if (data.admin_password) cfg.adminPassword = data.admin_password;
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
            cfg.githubToken = gc.github_token;
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
      Authorization: "token " + cfg.githubToken,
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
})(window);
