import { useEffect, useRef } from "react";

// ── Country data (world-atlas, geographic lon/lat) ────────────────────────────
let geoCache = null;
let geoPromise = null;
function fetchGeo() {
  if (geoCache) return Promise.resolve(geoCache);
  if (geoPromise) return geoPromise;
  geoPromise = fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then((r) => r.json())
    .then((t) => { geoCache = t; return t; });
  return geoPromise;
}

// ── US state data (us-atlas, geographic WGS84) ───────────────────────────────
let statesCache = null;
let statesPromise = null;
function fetchStates() {
  if (statesCache) return Promise.resolve(statesCache);
  if (statesPromise) return statesPromise;
  statesPromise = fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
    .then((r) => r.json())
    .then((t) => { statesCache = t; return t; });
  return statesPromise;
}

// ── Projection ────────────────────────────────────────────────────────────────
const WORLD = { lngMin: -180, lngMax: 180,  latMin: -58, latMax: 80 };
const NA    = { lngMin: -173, lngMax:  -26, latMin:  22, latMax: 73 };
const CA    = { lngMin: -134, lngMax: -108, latMin:  32, latMax: 44 };
const ANIM_DURATION = 500;

function isCalifornia(lat, lng)   { return lat >= 32 && lat <= 42 && lng >= -125 && lng <= -114; }
function isNorthAmerica(lat, lng) { return lat >= 22 && lat <= 73 && lng >= -170 && lng <= -50; }
function targetBoundsFor(coords) {
  if (!coords) return WORLD;
  if (isCalifornia(coords.lat, coords.lng))   return CA;
  if (isNorthAmerica(coords.lat, coords.lng)) return NA;
  return WORLD;
}

function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpBounds(a, b, t) {
  return {
    lngMin: lerp(a.lngMin, b.lngMin, t), lngMax: lerp(a.lngMax, b.lngMax, t),
    latMin: lerp(a.latMin, b.latMin, t), latMax: lerp(a.latMax, b.latMax, t),
  };
}

function mercY(lat) {
  const r = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + r / 2));
}
function projX(lng, b) { return (lng - b.lngMin) / (b.lngMax - b.lngMin); }
function projY(lat, b) {
  const y = mercY(lat), yMin = mercY(b.latMin), yMax = mercY(b.latMax);
  return 1 - (y - yMin) / (yMax - yMin);
}

// ── Generic arc-path renderer ─────────────────────────────────────────────────
function buildArcs(topo, toScreen) {
  const { scale, translate } = topo.transform;
  return topo.arcs.map((arc) => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => { x += dx; y += dy; return toScreen(x * scale[0] + translate[0], y * scale[1] + translate[1]); });
  });
}

function tracePath(ctx, decodedArcs, rings, w) {
  ctx.beginPath();
  rings.forEach((ring) => {
    let first = true, prevPx = null;
    ring.forEach((idx) => {
      const rev = idx < 0;
      const pts = decodedArcs[rev ? ~idx : idx];
      const ordered = rev ? [...pts].reverse() : pts;
      ordered.forEach(([px, py]) => {
        if (first) { ctx.moveTo(px, py); first = false; }
        else if (Math.abs(px - prevPx) > w * 0.5) { ctx.moveTo(px, py); }
        else { ctx.lineTo(px, py); }
        prevPx = px;
      });
    });
    ctx.closePath();
  });
}

function eachGeom(geom, fn) {
  if (!geom) return;
  if (geom.type === "GeometryCollection") { geom.geometries.forEach(g => eachGeom(g, fn)); return; }
  fn(geom);
}

// ── Country map renderer ──────────────────────────────────────────────────────
function drawCountries(ctx, topo, w, h, isDark, bounds) {
  const arcs = buildArcs(topo, (lng, lat) => [projX(lng, bounds) * w, projY(lat, bounds) * h]);

  ctx.fillStyle = isDark ? "#1a1a1a" : "#efefef";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = isDark ? "#333333" : "#bebebe";

  const zoom = 360 / (bounds.lngMax - bounds.lngMin);
  const borderOpacity = Math.min(1, Math.max(0, (zoom - 1.8) / 0.7));

  eachGeom(topo.objects.countries, (geom) => {
    const arcSets = geom.type === "Polygon" ? [geom.arcs] : geom.type === "MultiPolygon" ? geom.arcs : [];
    arcSets.forEach((rings) => {
      tracePath(ctx, arcs, rings, w);
      ctx.fill("evenodd");
      if (borderOpacity > 0) {
        ctx.strokeStyle = isDark ? `rgba(26,26,26,${borderOpacity})` : `rgba(239,239,239,${borderOpacity})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }
    });
  });
}

// ── US state border renderer ──────────────────────────────────────────────────
function drawStates(ctx, topo, w, h, isDark, bounds, opacity) {
  if (opacity <= 0 || !topo) return;

  const arcs = buildArcs(topo, (lng, lat) => [projX(lng, bounds) * w, projY(lat, bounds) * h]);

  ctx.strokeStyle = isDark ? `rgba(26,26,26,${opacity})` : `rgba(239,239,239,${opacity})`;
  ctx.lineWidth = 0.6;

  eachGeom(topo.objects.states, (geom) => {
    const arcSets = geom.type === "Polygon" ? [geom.arcs] : geom.type === "MultiPolygon" ? geom.arcs : [];
    arcSets.forEach((rings) => {
      rings.forEach((ring) => {
        tracePath(ctx, arcs, [ring], w);
        ctx.stroke();
      });
    });
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function WorldMap({ coords, allCoords = [] }) {
  const canvasRef        = useRef(null);
  const markerRef        = useRef(null);
  const staticMarkersRef = useRef(null);
  const topoRef          = useRef(null);
  const statesRef        = useRef(null);
  const isDarkRef        = useRef(false);
  const curBounds        = useRef(WORLD);
  const animFrom         = useRef(WORLD);
  const animTo           = useRef(WORLD);
  const rafRef           = useRef(null);
  const coordsRef        = useRef(coords);
  const allCoordsRef     = useRef(allCoords);
  coordsRef.current    = coords;
  allCoordsRef.current = allCoords;

  function renderFrame(b) {
    const canvas = canvasRef.current;
    const topo   = topoRef.current;
    if (canvas && topo) {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      if (w && h) {
        canvas.width  = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        drawCountries(ctx, topo, w, h, isDarkRef.current, b);

        // State borders fade in at CA zoom (≈14×) from zoom 5× onward
        const zoom = 360 / (b.lngMax - b.lngMin);
        const stateOpacity = Math.min(1, Math.max(0, (zoom - 5) / 5));
        drawStates(ctx, statesRef.current, w, h, isDarkRef.current, b, stateOpacity);
      }
    }
    const marker = markerRef.current;
    const c = coordsRef.current;
    if (marker && c) {
      marker.style.left = `${projX(c.lng, b) * 100}%`;
      marker.style.top  = `${projY(c.lat, b) * 100}%`;
    }

    const staticContainer = staticMarkersRef.current;
    if (staticContainer && !coordsRef.current) {
      const children = staticContainer.children;
      const pts = allCoordsRef.current;
      for (let i = 0; i < children.length && i < pts.length; i++) {
        children[i].style.left = `${projX(pts[i].lng, b) * 100}%`;
        children[i].style.top  = `${projY(pts[i].lat, b) * 100}%`;
      }
    }
  }

  function animateTo(target) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    animFrom.current = { ...curBounds.current };
    animTo.current   = target;
    const start = performance.now();
    function tick(now) {
      const raw = Math.min((now - start) / ANIM_DURATION, 1);
      const b   = lerpBounds(animFrom.current, animTo.current, easeInOut(raw));
      curBounds.current = b;
      renderFrame(b);
      if (raw < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    isDarkRef.current = false; // dark mode disabled
    const onChange = (e) => { isDarkRef.current = false; renderFrame(curBounds.current); };
    mq.addEventListener("change", onChange);

    fetchGeo().then((topo) => { topoRef.current = topo; renderFrame(curBounds.current); });
    fetchStates().then((s) => { statesRef.current = s; renderFrame(curBounds.current); });

    const ro = new ResizeObserver(() => renderFrame(curBounds.current));
    if (canvasRef.current) ro.observe(canvasRef.current);

    return () => {
      mq.removeEventListener("change", onChange);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    animateTo(targetBoundsFor(coords));
  }, [coords]); // eslint-disable-line react-hooks/exhaustive-deps

  const initMx = coords ? `${projX(coords.lng, curBounds.current) * 100}%` : null;
  const initMy = coords ? `${projY(coords.lat, curBounds.current) * 100}%` : null;

  return (
    <div className="world-map">
      <canvas ref={canvasRef} className="world-map-canvas" />
      {coords ? (
        <div ref={markerRef} className="map-marker" style={{ left: initMx, top: initMy }} aria-hidden="true">
          <div className="map-marker-pulse" />
          <div className="map-marker-dot" />
        </div>
      ) : (
        <div ref={staticMarkersRef} aria-hidden="true">
          {allCoords.map((c, i) => (
            <div
              key={i}
              className="map-marker map-marker-static"
              style={{
                left: `${projX(c.lng, curBounds.current) * 100}%`,
                top:  `${projY(c.lat, curBounds.current) * 100}%`,
              }}
            >
              <div className="map-marker-dot" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
