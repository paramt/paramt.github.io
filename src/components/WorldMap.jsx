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
function targetBoundsFor(pts) {
  if (!pts || pts.length === 0) return WORLD;
  if (pts.length === 1) {
    const { lat, lng } = pts[0];
    if (isCalifornia(lat, lng))   return CA;
    if (isNorthAmerica(lat, lng)) return NA;
    return WORLD;
  }
  const lats = pts.map(p => p.lat);
  const lngs = pts.map(p => p.lng);
  const latMin = Math.min(...lats), latMax = Math.max(...lats);
  const lngMin = Math.min(...lngs), lngMax = Math.max(...lngs);
  const latPad = Math.max((latMax - latMin) * 0.4, 2);
  const lngPad = Math.max((lngMax - lngMin) * 0.4, 3);
  return {
    latMin: Math.max(latMin - latPad, -58),
    latMax: Math.min(latMax + latPad, 80),
    lngMin: Math.max(lngMin - lngPad, -180),
    lngMax: Math.min(lngMax + lngPad, 180),
  };
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

// ── Route polyline renderer ───────────────────────────────────────────────────
function drawRoute(ctx, pts, w, h, b) {
  if (!pts || pts.length < 2) return;
  const px = pts.map(c => projX(c.lng, b) * w);
  const py = pts.map(c => projY(c.lat, b) * h);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(px[0], py[0]);
  if (pts.length === 2) {
    ctx.lineTo(px[1], py[1]);
  } else {
    // Smooth corners: quadratic bezier with each waypoint as control point,
    // passing through the midpoints between consecutive waypoints.
    ctx.lineTo((px[0] + px[1]) / 2, (py[0] + py[1]) / 2);
    for (let i = 1; i < pts.length - 1; i++) {
      ctx.quadraticCurveTo(px[i], py[i], (px[i] + px[i + 1]) / 2, (py[i] + py[i + 1]) / 2);
    }
    ctx.lineTo(px[pts.length - 1], py[pts.length - 1]);
  }
  ctx.strokeStyle = '#eb4034';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.55;
  ctx.setLineDash([5, 4]);
  ctx.stroke();
  ctx.restore();
}

// ── Component ─────────────────────────────────────────────────────────────────
// coords: { lat, lng } | Array<{ lat, lng }> | null
export default function WorldMap({ coords, allCoords = [], noZoom = false, onMarkerHover, onMarkerLeave, onMarkerClick }) {
  // Normalise coords to an array (or null) for uniform handling
  const coordsPts = coords ? (Array.isArray(coords) ? coords : [coords]) : null;

  const canvasRef          = useRef(null);
  const activeMarkersRef   = useRef(null);
  const staticMarkersRef   = useRef(null);
  const topoRef            = useRef(null);
  const statesRef          = useRef(null);
  const isDarkRef          = useRef(false);
  const curBounds          = useRef(WORLD);
  const animFrom           = useRef(WORLD);
  const animTo             = useRef(WORLD);
  const rafRef             = useRef(null);
  const coordsPtsRef       = useRef(coordsPts);
  const allCoordsRef       = useRef(allCoords);
  const noZoomRef          = useRef(noZoom);
  coordsPtsRef.current   = coordsPts;
  allCoordsRef.current   = allCoords;
  noZoomRef.current      = noZoom;

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

        const pts = coordsPtsRef.current;
        if (pts && pts.length > 1) drawRoute(ctx, pts, w, h, b);
      }
    }

    const activeContainer = activeMarkersRef.current;
    const pts = coordsPtsRef.current;
    if (activeContainer && pts) {
      const endpts = pts.length > 1 ? [pts[0], pts[pts.length - 1]] : pts;
      const children = activeContainer.children;
      for (let i = 0; i < children.length && i < endpts.length; i++) {
        children[i].style.left = `${projX(endpts[i].lng, b) * 100}%`;
        children[i].style.top  = `${projY(endpts[i].lat, b) * 100}%`;
      }
    }

    const staticContainer = staticMarkersRef.current;
    if (staticContainer && (!coordsPtsRef.current || noZoomRef.current)) {
      const children = staticContainer.children;
      const allPts = allCoordsRef.current;
      for (let i = 0; i < children.length && i < allPts.length; i++) {
        children[i].style.left = `${projX(allPts[i].lng, b) * 100}%`;
        children[i].style.top  = `${projY(allPts[i].lat, b) * 100}%`;
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
    animateTo(noZoom ? WORLD : targetBoundsFor(coordsPts));
  }, [coords, noZoom]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="world-map">
      <canvas ref={canvasRef} className="world-map-canvas" />
      {coordsPts && (
        <div ref={activeMarkersRef} aria-hidden="true">
          {(coordsPts.length > 1 ? [coordsPts[0], coordsPts[coordsPts.length - 1]] : coordsPts).map((c, i) => (
            <div
              key={i}
              className="map-marker"
              style={{
                left: `${projX(c.lng, curBounds.current) * 100}%`,
                top:  `${projY(c.lat, curBounds.current) * 100}%`,
              }}
            >
              {coordsPts.length === 1 && <div className="map-marker-pulse" />}
              <div className="map-marker-dot" />
            </div>
          ))}
        </div>
      )}
      {(!coordsPts || noZoom) && (
        <div ref={staticMarkersRef} aria-hidden="true">
          {allCoords.map((c, i) => (
            <div
              key={i}
              className="map-marker map-marker-static"
              style={{
                left: `${projX(c.lng, curBounds.current) * 100}%`,
                top:  `${projY(c.lat, curBounds.current) * 100}%`,
              }}
              onMouseEnter={() => onMarkerHover?.(c.event)}
              onMouseLeave={() => onMarkerLeave?.()}
              onClick={() => onMarkerClick?.(c.event)}
            >
              <div className="map-marker-dot" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
