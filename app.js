const methodDetails = {
  GET: {
    title: "GET — Read / fetch data",
    when: "Use when you want to retrieve information. Opening a profile, listing users, downloading a report.",
    body: "No request body. Filters go in the URL as query params.",
    example: `GET https://jsonplaceholder.typicode.com/posts/1
Header: Accept: application/json`,
    expect: "200 OK + JSON object/array. Does not change server data.",
    postman: "1) Method = GET  2) Paste URL  3) Auth if needed  4) Send  5) Read Body → Pretty",
  },
  POST: {
    title: "POST — Create something new",
    when: "Use when you create a new resource: new user, new order, submit a form.",
    body: "Yes — JSON body with the new fields.",
    example: `POST https://jsonplaceholder.typicode.com/posts
Content-Type: application/json

{
  "title": "API Lab",
  "body": "Learning POST",
  "userId": 1
}`,
    expect: "201 Created (or 200). Response often includes a new id.",
    postman: "1) Method = POST  2) Body → raw → JSON  3) Paste JSON  4) Send",
  },
  PUT: {
    title: "PUT — Replace the whole resource",
    when: "Use when you send the full updated object. Missing fields may be cleared depending on the API.",
    body: "Yes — full resource JSON.",
    example: `PUT https://jsonplaceholder.typicode.com/posts/1

{
  "id": 1,
  "title": "Replaced title",
  "body": "Full new body",
  "userId": 1
}`,
    expect: "200 OK with the replaced resource.",
    postman: "1) Method = PUT  2) URL includes the id  3) Body = full JSON  4) Send",
  },
  PATCH: {
    title: "PATCH — Update only some fields",
    when: "Use when you change one or two fields (e.g. only title) without resending everything.",
    body: "Yes — partial JSON with only changed fields.",
    example: `PATCH https://jsonplaceholder.typicode.com/posts/1

{
  "title": "Only this field changes"
}`,
    expect: "200 OK with the merged resource.",
    postman: "1) Method = PATCH  2) Body = only fields to change  3) Send",
  },
  DELETE: {
    title: "DELETE — Remove a resource",
    when: "Use when you delete by id: remove a post, cancel a draft, deactivate a record.",
    body: "Usually no body. Id is in the URL path.",
    example: `DELETE https://jsonplaceholder.typicode.com/posts/1`,
    expect: "200 OK or 204 No Content. JSONPlaceholder returns {}.",
    postman: "1) Method = DELETE  2) URL with id  3) Auth if required  4) Send",
  },
};

const presets = {
  users: {
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/users",
    auth: "none",
    paramKey: "_limit",
    paramVal: "3",
    body: "",
    lesson:
      "Beginner step 1: GET = ask for data. This free API returns users. _limit=3 means only 3 users. No login needed. Press Send and look for status 200.",
  },
  user: {
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/users/1",
    auth: "none",
    paramKey: "",
    paramVal: "",
    body: "",
    lesson:
      "Beginner step 2: the number 1 in /users/1 is the user id (path parameter). After Send, find \"name\" and \"email\" in the JSON answer.",
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
    lesson:
      "Beginner step 3: POST = create new. Open Body tab — that JSON is the new post. Send → expect 201 and a new id. You are creating data now.",
  },
  update: {
    method: "PUT",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    auth: "none",
    paramKey: "",
    paramVal: "",
    body: JSON.stringify(
      { id: 1, title: "Fully replaced title", body: "This is a full replace", userId: 1 },
      null,
      2
    ),
    lesson:
      "Beginner step 4: PUT = replace the whole post. You must send the full object. Compare with PATCH in the next step.",
  },
  patch: {
    method: "PATCH",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    auth: "none",
    paramKey: "",
    paramVal: "",
    body: JSON.stringify({ title: "Only the title changes" }, null, 2),
    lesson:
      "Beginner step 5: PATCH = edit only some fields. Here we change only title. This is how most “edit form” screens work.",
  },
  remove: {
    method: "DELETE",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    auth: "none",
    paramKey: "",
    paramVal: "",
    body: "",
    lesson:
      "Beginner step 6: DELETE = remove. No body needed. Fake API returns success. In real company APIs you usually need permission first.",
  },
  dog: {
    method: "GET",
    url: "https://dog.ceo/api/breeds/image/random",
    auth: "none",
    paramKey: "",
    paramVal: "",
    body: "",
    lesson:
      "Fun free GET: response has message = image link. Copy that link into a browser tab to see the dog. Builds confidence fast.",
  },
  weather: {
    method: "GET",
    url: "https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.21&current=temperature_2m,wind_speed_10m",
    auth: "none",
    paramKey: "",
    paramVal: "",
    body: "",
    lesson:
      "Real free weather API (Delhi lat/long). No key. After Send, open current.temperature_2m — that number is live weather data.",
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
    lesson:
      "Auth lesson: username postman + password password → 200. Now change password to wrong and Send again → 401. That is how APIs reject bad login.",
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
    lesson:
      "API key lesson: we attach header X-Api-Key. httpbin echoes headers so you can see it. Real products give you a real key from their dashboard — this value is only a teaching demo.",
  },
};

const $ = (id) => document.getElementById(id);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderMethodDetail(method) {
  const d = methodDetails[method];
  if (!d || !$("methodDetail")) return;
  $("methodDetail").innerHTML = `
    <div class="detail-label">${escapeHtml(d.title)}</div>
    <div class="method-rich">
      <p><strong>When to use:</strong> ${escapeHtml(d.when)}</p>
      <p><strong>Body needed?</strong> ${escapeHtml(d.body)}</p>
      <p><strong>Expected result:</strong> ${escapeHtml(d.expect)}</p>
      <p><strong>In Postman:</strong> ${escapeHtml(d.postman)}</p>
      <pre><code>${escapeHtml(d.example)}</code></pre>
    </div>
  `;
}

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

  if ($("presetLesson") && p.lesson) {
    $("presetLesson").textContent = p.lesson;
  }

  if (p.auth !== "none") activateTab("auth");
  else if (p.method !== "GET" && p.method !== "DELETE" && p.body) activateTab("body");
  else activateTab("params");

  $("responseOut").innerHTML = `<code>${escapeHtml(p.lesson || "Ready.")}\n\nPress Send to run this request.</code>`;
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

    const tip = res.ok
      ? "\n\n// Success — read the JSON above. Status 2xx means it worked."
      : "\n\n// Failed — check Auth, URL, and body. 401 = wrong login/key. 404 = wrong URL.";

    $("statusBadge").textContent = `${res.status} ${res.statusText || ""}`.trim();
    $("statusBadge").className = `status ${res.ok ? "ok" : "err"}`;
    $("timeBadge").textContent = `${ms} ms`;
    $("responseOut").innerHTML = `<code>${escapeHtml((pretty || "(empty body)") + tip)}</code>`;
  } catch (err) {
    const ms = Math.round(performance.now() - started);
    $("statusBadge").textContent = "Network error";
    $("statusBadge").className = "status err";
    $("timeBadge").textContent = `${ms} ms`;
    $("responseOut").innerHTML = `<code>${escapeHtml(err.message)}\n\nTip: some APIs block browsers (CORS). The presets on the left are CORS-friendly. Postman desktop can still call APIs that browsers block.</code>`;
  } finally {
    $("sendBtn").disabled = false;
  }
}

document.querySelectorAll(".method-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".method-card").forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    renderMethodDetail(card.dataset.method);
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
renderMethodDetail("GET");
