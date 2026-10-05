const methodExamples = {
  GET: `GET https://jsonplaceholder.typicode.com/posts/1
Headers: Accept: application/json
→ 200 OK with the post object`,
  POST: `POST https://jsonplaceholder.typicode.com/posts
Body (JSON):
{
  "title": "API Lab",
  "body": "Learning POST",
  "userId": 1
}
→ 201 Created with the new post (+ id)`,
  PUT: `PUT https://jsonplaceholder.typicode.com/posts/1
Body (JSON): full replacement of the post
→ 200 OK with the updated resource`,
  PATCH: `PATCH https://jsonplaceholder.typicode.com/posts/1
Body (JSON): { "title": "Only this field changes" }
→ 200 OK with merged fields`,
  DELETE: `DELETE https://jsonplaceholder.typicode.com/posts/1
→ 200 OK (JSONPlaceholder returns {})`,
};

const presets = {
  users: {
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/users",
    auth: "none",
    paramKey: "_limit",
    paramVal: "3",
    body: "",
    note: "Free fake REST API — no key needed.",
  },
  user: {
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/users/1",
    auth: "none",
    paramKey: "",
    paramVal: "",
    body: "",
  },
  create: {
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    auth: "none",
    paramKey: "",
    paramVal: "",
    body: JSON.stringify(
      { title: "API Lab", body: "Hello from the Postman-style UI", userId: 1 },
      null,
      2
    ),
  },
  dog: {
    method: "GET",
    url: "https://dog.ceo/api/breeds/image/random",
    auth: "none",
    paramKey: "",
    paramVal: "",
    body: "",
  },
  weather: {
    method: "GET",
    url: "https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.21&current=temperature_2m,wind_speed_10m",
    auth: "none",
    paramKey: "",
    paramVal: "",
    body: "",
  },
  basic: {
    method: "GET",
    url: "https://httpbin.org/basic-auth/postman/password",
    auth: "basic",
    basicUser: "postman",
    basicPass: "password",
    paramKey: "",
    paramVal: "",
    body: "",
  },
  apikey: {
    method: "GET",
    url: "https://httpbin.org/headers",
    auth: "apikey",
    apiKeyName: "X-Api-Key",
    apiKeyValue: "demo-key-abc123",
    paramKey: "",
    paramVal: "",
    body: "",
    note: "httpbin echoes headers back — proof your API key was sent. Real APIs would validate the key.",
  },
};

const $ = (id) => document.getElementById(id);

function setAuthVisibility(type) {
  $("authApiKey").hidden = type !== "apikey";
  $("authBasic").hidden = type !== "basic";
  $("authBearer").hidden = type !== "bearer";
}

function activateTab(name) {
  document.querySelectorAll(".pm-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.tab === name);
  });
  document.querySelectorAll(".pm-panel").forEach((p) => {
    p.classList.toggle("active", p.id === `tab-${name}`);
  });
}

function applyPreset(name) {
  const p = presets[name];
  if (!p) return;

  $("methodSelect").value = p.method;
  $("urlInput").value = p.url;
  $("authType").value = p.auth;
  setAuthVisibility(p.auth);
  $("paramKey").value = p.paramKey ?? "";
  $("paramVal").value = p.paramVal ?? "";
  $("bodyInput").value = p.body ?? "";

  if (p.basicUser) $("basicUser").value = p.basicUser;
  if (p.basicPass) $("basicPass").value = p.basicPass;
  if (p.apiKeyName) $("apiKeyName").value = p.apiKeyName;
  if (p.apiKeyValue) $("apiKeyValue").value = p.apiKeyValue;

  document.querySelectorAll(".pm-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.preset === name);
  });

  if (p.auth !== "none") activateTab("auth");
  else if (p.method !== "GET" && p.body) activateTab("body");
  else activateTab("params");

  if (p.note) {
    $("responseOut").innerHTML = `<code>${escapeHtml(p.note)}\n\nReady — press Send.</code>`;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildUrl() {
  let url = $("urlInput").value.trim();
  const key = $("paramKey").value.trim();
  const val = $("paramVal").value.trim();
  if (!key || !val) return url;
  if (url.includes(`${key}=`)) return url;
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
}

function buildHeaders() {
  const headers = {};
  const hk = $("headerKey").value.trim();
  const hv = $("headerVal").value.trim();
  if (hk && hv) headers[hk] = hv;

  const auth = $("authType").value;
  if (auth === "apikey") {
    const name = $("apiKeyName").value.trim() || "X-Api-Key";
    headers[name] = $("apiKeyValue").value;
  } else if (auth === "basic") {
    const token = btoa(`${$("basicUser").value}:${$("basicPass").value}`);
    headers.Authorization = `Basic ${token}`;
  } else if (auth === "bearer") {
    headers.Authorization = `Bearer ${$("bearerToken").value}`;
  }

  const method = $("methodSelect").value;
  const body = $("bodyInput").value.trim();
  if (body && method !== "GET" && method !== "DELETE") {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  return headers;
}

async function sendRequest() {
  const method = $("methodSelect").value;
  const url = buildUrl();
  const headers = buildHeaders();
  const bodyText = $("bodyInput").value.trim();

  const opts = { method, headers };
  if (bodyText && method !== "GET" && method !== "HEAD") {
    opts.body = bodyText;
  }

  $("statusBadge").textContent = "Sending…";
  $("statusBadge").className = "status idle";
  $("timeBadge").textContent = "—";
  $("responseOut").innerHTML = `<code>Requesting ${escapeHtml(method)} ${escapeHtml(url)} …</code>`;
  $("sendBtn").disabled = true;

  const started = performance.now();
  try {
    const res = await fetch(url, opts);
    const ms = Math.round(performance.now() - started);
    const text = await res.text();
    let pretty = text;
    try {
      pretty = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      /* keep raw */
    }

    $("statusBadge").textContent = `${res.status} ${res.statusText || ""}`.trim();
    $("statusBadge").className = `status ${res.ok ? "ok" : "err"}`;
    $("timeBadge").textContent = `${ms} ms`;
    $("responseOut").innerHTML = `<code>${escapeHtml(pretty || "(empty body)")}</code>`;
  } catch (err) {
    const ms = Math.round(performance.now() - started);
    $("statusBadge").textContent = "Network error";
    $("statusBadge").className = "status err";
    $("timeBadge").textContent = `${ms} ms`;
    $("responseOut").innerHTML = `<code>${escapeHtml(err.message)}\n\nTip: some APIs block browsers (CORS). The presets on the left are CORS-friendly.</code>`;
  } finally {
    $("sendBtn").disabled = false;
  }
}

document.querySelectorAll(".method-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".method-card").forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    $("methodExample").textContent = methodExamples[card.dataset.method];
  });
});

document.querySelectorAll(".pm-tab").forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

document.querySelectorAll(".pm-item, .free-card").forEach((el) => {
  el.addEventListener("click", () => {
    applyPreset(el.dataset.preset);
    if (el.classList.contains("free-card")) {
      document.getElementById("playground").scrollIntoView({ behavior: "smooth" });
      setTimeout(sendRequest, 350);
    }
  });
});

$("authType").addEventListener("change", (e) => setAuthVisibility(e.target.value));
$("sendBtn").addEventListener("click", sendRequest);

$("urlInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendRequest();
});

setAuthVisibility("none");
