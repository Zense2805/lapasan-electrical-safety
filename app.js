(function () {
  "use strict";

  const config = window.LAPASAN_SITE_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Navigation. The site can be deployed in a GitHub Pages subfolder.
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = $("main-navigation");
  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const open = !navigation.classList.contains("open");
      navigation.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }));
  }
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const id = visible[0].target.id;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === "#" + id;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-18% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] });
    ["home", "assessment", "map", "safety", "action-plan", "about"].forEach((id) => {
      const el = $(id);
      if (el) observer.observe(el);
    });
  }

  // The survey lives in a Google Form controlled by the project team.
  // Unapproved/invalid links are deliberately not activated.
  const surveyLink = $("real-survey-link");
  const surveyInfo = $("survey-status-detail");
  const formUrl = String(config.surveyUrl || "").trim();
  const trustedForm = /^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/)/i.test(formUrl);
  if (config.surveyOpen === true && trustedForm && surveyLink) {
    surveyLink.href = formUrl;
    surveyLink.textContent = "";
    surveyLink.appendChild(document.createTextNode("Open the approved household survey "));
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("class", "icon");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-external");
    icon.appendChild(use);
    surveyLink.appendChild(icon);
    surveyLink.setAttribute("target", "_blank");
    surveyLink.setAttribute("rel", "noopener noreferrer");
    surveyLink.removeAttribute("aria-disabled");
    surveyLink.classList.remove("is-disabled");
    if (surveyInfo) surveyInfo.textContent = "You will be directed to an approved external Google Form. Participation is voluntary. Read the form's consent notice before answering.";
  } else if (surveyLink) {
    surveyLink.addEventListener("click", (event) => event.preventDefault());
  }

  // Real, working local-only safety check. No data leaves the browser.
  // This is not the consented research questionnaire or a diagnosis.
  const dialog = $("survey-dialog");
  const previewForm = $("preview-form");
  const previewSteps = Array.from(document.querySelectorAll(".demo-step"));
  const next = $("step-next");
  const back = $("step-back");
  const error = $("dialog-error");
  const progressFill = $("progress-fill");
  const progressText = $("dialog-progress-text");
  const result = $("demo-result");
  const recommendations = $("demo-recommendations");
  const download = $("download-feedback");
  let step = 0;
  let lastReminders = [];

  function setStep(index) {
    step = index;
    previewSteps.forEach((el, i) => el.classList.toggle("active", i === step));
    if (progressFill) progressFill.style.width = ((step + 1) / previewSteps.length * 100) + "%";
    if (progressText) progressText.textContent = "Step " + (step + 1) + " of " + previewSteps.length;
    if (back) back.hidden = step === 0;
    if (next) {
      next.hidden = false;
      next.textContent = step === previewSteps.length - 1 ? "Show my reminders" : "Next";
    }
    if (result) result.hidden = true;
    if (error) { error.hidden = true; error.textContent = ""; }
  }
  function checkedValue(name) {
    const input = previewForm && previewForm.querySelector('input[name="' + name + '"]:checked');
    return input ? input.value : "unknown";
  }
  function showFeedback() {
    lastReminders = [];
    const warning = checkedValue("warning_sign");
    const extensions = checkedValue("extension_use");
    const evacuation = checkedValue("evacuation");

    if (warning === "yes") {
      lastReminders.push("You reported warning signs. Do not touch, open, or test potentially faulty equipment. Stop using the affected item if it is safe to do so, keep clear of smoke or sparks, and seek qualified assistance. For immediate danger, leave and call emergency services.");
    } else if (warning === "no") {
      lastReminders.push("Even without reported warning signs, keep checking that appliance cords and plugs are visibly intact without touching suspected hazards. Report problems to a qualified electrician.");
    } else {
      lastReminders.push("Not sure about warning signs? Ask a qualified electrician or appropriate barangay contact for guidance. Never experiment with live wiring.");
    }
    if (extensions === "often") {
      lastReminders.push("Frequent extension-cord use warrants a closer look at safe load ratings. Avoid connecting extension cords to each other or supplying heavy appliances through them. Seek professional advice for additional permanent outlets.");
    } else {
      lastReminders.push("Avoid overloaded sockets and daisy-chained extensions. Follow manufacturer ratings and replace visibly damaged accessories through qualified help.");
    }
    if (evacuation === "no" || evacuation === "unknown") {
      lastReminders.push("Agree on an escape route and a meeting place with household members. Make sure everyone knows how to call local emergency responders.");
    } else {
      lastReminders.push("Keep your family's emergency escape plan current, and practice how to get to a safe meeting place.");
    }
    lastReminders.push("This demonstration does not assess actual fire probability, code compliance, or a specific home's electrical safety.");
    recommendations.textContent = "";
    lastReminders.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      recommendations.appendChild(li);
    });
    previewSteps.forEach((el) => el.classList.remove("active"));
    if (result) result.hidden = false;
    if (progressFill) progressFill.style.width = "100%";
    if (progressText) progressText.textContent = "Practice check complete";
    if (back) back.hidden = true;
    if (next) next.hidden = true;
  }
  const openButton = $("open-preview");
  const closeButton = $("close-preview");
  if (dialog && openButton && closeButton && previewForm && next && back && result && recommendations) {
    const close = () => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
      previewForm.reset();
      lastReminders = [];
      setStep(0);
    };
    openButton.addEventListener("click", () => {
      previewForm.reset();
      setStep(0);
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
    closeButton.addEventListener("click", close);
    dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });
    previewForm.addEventListener("submit", (event) => event.preventDefault());
    next.addEventListener("click", () => {
      if (step === 0 && checkedValue("consent_preview") !== "yes") {
        error.textContent = "Please confirm this is a local-only practice check, or close the window.";
        error.hidden = false;
        return;
      }
      if (step === previewSteps.length - 1) showFeedback();
      else setStep(step + 1);
    });
    back.addEventListener("click", () => setStep(Math.max(0, step - 1)));
    if (download) download.addEventListener("click", () => {
      if (!lastReminders.length) return;
      const content = "LAPASAN ELECTRICAL SAFETY - PRACTICE REMINDERS\n" +
        "Educational guidance only, not an inspection or fire-risk rating.\n\n" +
        lastReminders.map((t, i) => (i + 1) + ". " + t).join("\n\n") +
        "\n\nNo survey responses were submitted or stored by this website.\n";
      const url = URL.createObjectURL(new Blob([content], {type: "text/plain;charset=utf-8"}));
      const link = document.createElement("a");
      link.href = url;
      link.download = "lapasan-safety-practice-reminders.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
    setStep(0);
  }

  // V3 maps: render OSM street tiles directly, with no external iframe/CDN dependency.
  // A local fallback remains visible when a preview sandbox or network blocks tiles.
  // No barangay boundary or fire-risk results are invented.
  const LAPASAN_CENTER = { lat: 8.48328, lng: 124.66490 };
  const MAX_ZOOM = 18, MIN_ZOOM = 11;
  const OSM_LOCATION_URL = "https://www.openstreetmap.org/?mlat=8.48328&mlon=124.6649#map=15/8.48328/124.6649";
  const mapControls = [];
  function projectToPixels(lat, lng, zoom) {
    const n = 256 * Math.pow(2, zoom);
    const r = Math.max(-85.05112878, Math.min(85.05112878, lat)) * Math.PI / 180;
    return { x: (lng + 180) / 360 * n, y: (1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n };
  }
  function pixelsToLatLng(x, y, zoom) {
    const n = 256 * Math.pow(2, zoom);
    const latitude = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI;
    return { lat: Math.max(-85.051, Math.min(85.051, latitude)), lng: (x / n * 360 + 540) % 360 - 180 };
  }
  function initStreetMap(root) {
    const layer = root.querySelector('.street-tile-layer');
    const loader = root.querySelector('.street-map-loading');
    const message = loader && loader.querySelector('p');
    const pin = root.querySelector('.street-pin');
    const initialZoom = Number(root.dataset.startZoom) || 15;
    const state = { center: { ...LAPASAN_CENTER }, zoom: initialZoom, loaded: false, draw: 0, drag: null };
    if (!layer) return null;
    function drawTiles() {
      const width = root.clientWidth, height = root.clientHeight;
      if (!width || !height) return;
      const centerPx = projectToPixels(state.center.lat, state.center.lng, state.zoom);
      const cornerX = centerPx.x - width / 2, cornerY = centerPx.y - height / 2;
      const minX = Math.floor(cornerX / 256), maxX = Math.floor((cornerX + width) / 256);
      const minY = Math.max(0, Math.floor(cornerY / 256)), maxY = Math.min(Math.pow(2, state.zoom)-1, Math.floor((cornerY + height) / 256));
      layer.replaceChildren();
      const currentDraw = ++state.draw;
      for (let tx = minX; tx <= maxX; tx++) {
        for (let ty = minY; ty <= maxY; ty++) {
          const tileX = (tx + Math.pow(2, state.zoom)) % Math.pow(2, state.zoom);
          const img = document.createElement('img');
          img.className = 'street-tile';
          img.alt = '';
          img.draggable = false;
          img.decoding = 'async';
          img.loading = 'eager';
          img.style.left = (tx * 256 - cornerX) + 'px';
          img.style.top = (ty * 256 - cornerY) + 'px';
          img.addEventListener('load', () => {
            if (state.draw !== currentDraw || !img.naturalWidth) return;
            state.loaded = true;
            root.classList.add('has-live-streets');
            if (loader) loader.setAttribute('aria-hidden', 'true');
          });
          img.src = 'https://tile.openstreetmap.org/' + state.zoom + '/' + tileX + '/' + ty + '.png';
          layer.appendChild(img);
        }
      }
      const targetPx = projectToPixels(LAPASAN_CENTER.lat, LAPASAN_CENTER.lng, state.zoom);
      if (pin) {
        const left = width/2 + targetPx.x - centerPx.x;
        const top = height/2 + targetPx.y - centerPx.y;
        pin.style.left = left + 'px'; pin.style.top = top + 'px';
        pin.hidden = left < -30 || top < -30 || left > width+30 || top > height+30;
      }
    }
    let failTimer = setTimeout(() => {
      if (!state.loaded && message) message.textContent = 'Street maps are blocked in this preview or the connection is offline. Use the link below for the real Lapasan map.';
    }, 5000);
    function setZoom(delta) {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, state.zoom + delta));
      if (next !== state.zoom) { state.zoom = next; drawTiles(); }
    }
    const plus = root.querySelector('.street-zoom-in'), minus = root.querySelector('.street-zoom-out');
    if (plus) plus.addEventListener('click', () => setZoom(1));
    if (minus) minus.addEventListener('click', () => setZoom(-1));
    root.addEventListener('keydown', event => {
      if (event.target !== root) return;
      const delta = { ArrowLeft:[-95,0], ArrowRight:[95,0], ArrowUp:[0,-95], ArrowDown:[0,95] }[event.key];
      if (delta) {
        event.preventDefault();
        const p = projectToPixels(state.center.lat, state.center.lng, state.zoom);
        state.center = pixelsToLatLng(p.x+delta[0],p.y+delta[1],state.zoom);
        drawTiles();
      } else if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(1); }
      else if (event.key === '-') { event.preventDefault(); setZoom(-1); }
    });
    root.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.target.closest('a,button')) return;
      state.drag = {x:e.clientX,y:e.clientY};
      root.classList.add('is-dragging');
      try { root.setPointerCapture(e.pointerId); } catch (_e) {}
    });
    root.addEventListener('pointermove', e => {
      if (!state.drag) return;
      layer.style.transform = 'translate('+(e.clientX-state.drag.x)+'px,'+(e.clientY-state.drag.y)+'px)';
      if (pin) pin.style.transform = 'translate(calc(-50% + '+(e.clientX-state.drag.x)+'px), calc(-100% + '+(e.clientY-state.drag.y)+'px))';
    });
    function finishDrag(e) {
      if (!state.drag) return;
      const dx = e.clientX-state.drag.x, dy = e.clientY-state.drag.y;
      state.drag=null;
      root.classList.remove('is-dragging');
      layer.style.transform='';
      if (pin) pin.style.transform='';
      const p=projectToPixels(state.center.lat,state.center.lng,state.zoom);
      state.center=pixelsToLatLng(p.x-dx,p.y-dy,state.zoom);
      drawTiles();
    }
    root.addEventListener('pointerup', finishDrag);
    root.addEventListener('pointercancel', e => { state.drag = null; root.classList.remove('is-dragging'); layer.style.transform=''; if(pin)pin.style.transform=''; });
    root.addEventListener('wheel', e => {
      if (!e.ctrlKey) return; // Preserve ordinary page scrolling.
      e.preventDefault(); setZoom(e.deltaY > 0 ? -1 : 1);
    }, {passive:false});
    if ('ResizeObserver' in window) new ResizeObserver(() => drawTiles()).observe(root);
    else window.addEventListener('resize', drawTiles);
    drawTiles();
    return { recenter() { state.center={...LAPASAN_CENTER};state.zoom=initialZoom;drawTiles(); }, zoomIn() {setZoom(1);}, zoomOut(){setZoom(-1);} };
  }
  document.querySelectorAll('.js-street-map').forEach(el => {
    const controller=initStreetMap(el);
    if (controller) mapControls.push(controller);
  });
  const recenter = $('recenter-lapasan');
  if (recenter) recenter.addEventListener('click', () => { if (mapControls[1]) mapControls[1].recenter(); });
  const boundaryStatus = $('boundary-status');
  if (boundaryStatus) boundaryStatus.textContent = 'Approximate Lapasan locality marker based on public coordinates; this is not an official barangay boundary. Obtain approved study zones before collecting mapped research data.';

  // Strict display rules. The PUBLIC map JSON must never contain raw survey data.
  // Review/privacy checks are administrative and technical guardrails, not a
  // substitute for data-protection approvals or methodology validation.
  const publicationUrl = String(config.mapDataPath || "data/public-map.json");
  const safeDataPath = /^data\/[a-zA-Z0-9/_-]+\.json$/.test(publicationUrl) && !publicationUrl.includes("..");
  function safeImagePath(path) {
    return /^assets\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp|svg)$/i.test(path) && !path.includes("..");
  }
  function textEl(tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    return element;
  }
  function displayMap(data) {
    if (!data || data.status !== "published" || data.reviewed !== true || !safeImagePath(data.mapImageUrl || "")) return;
    const minCount = Number(data.minimumZoneResponses);
    if (!Number.isInteger(minCount) || minCount < 10) return;
    if (!Array.isArray(data.zones) || data.zones.length > 100) return;
    const zones = data.zones;
    const permitted = ["High", "Moderate", "Lower", "Unclassified"];
    if (zones.some((z) => !z || typeof z !== "object" || !Number.isInteger(Number(z.responses)) || Number(z.responses) < minCount || typeof z.zone !== "string" || z.zone.length > 80 || !permitted.includes(z.priority))) return;

    const image = $("published-map");
    const approvedPanel = $("validated-map-panel");
    if (!image || !approvedPanel) return;
    image.onerror = () => { image.hidden = true; approvedPanel.hidden = true; $("map-status-chip").textContent = "Published map image unavailable"; };
    image.onload = () => { image.hidden = false; approvedPanel.hidden = false; };
    image.src = data.mapImageUrl;
    image.alt = String(data.mapTitle || "Validated aggregate zone-level screening map").slice(0, 160);
    $("map-status-chip").textContent = "Validated map available";
    $("map-data-date").textContent = data.validationDate ? "Validation: " + String(data.validationDate).slice(0, 25) : "Validated dataset";
    const grid = $("zone-grid");
    if (zones.length && grid) {
      grid.textContent = "";
      for (const z of zones) {
        const card = document.createElement("article");
        card.className = "zone-summary";
        const tier = textEl("span", "priority-pill priority-" + z.priority.toLowerCase(), z.priority + " screening priority");
        const name = textEl("h4", "", z.zone);
        const detail = textEl("p", "", "Aggregate survey responses: " + String(z.responses));
        card.append(tier, name, detail);
        grid.appendChild(card);
      }
      $("published-zones").hidden = false;
    }
  }
  if (safeDataPath) {
    fetch(publicationUrl, { cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error("No publication data");
      return response.json();
    }).then(displayMap).catch(() => { /* Pending view is the safe fallback. */ });
  }
})();
