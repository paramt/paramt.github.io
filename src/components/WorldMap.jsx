import { useEffect, useRef } from "react";

function getIsDark() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

// ── Country data (world-atlas, geographic lon/lat) ────────────────────────────
let geoCache = null;
let geoPromise = null;
function fetchGeo() {
  if (geoCache) return Promise.resolve(geoCache);
  if (geoPromise) return geoPromise;
  geoPromise = fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
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

// Returns a projector (lng, lat) => [px, py] that preserves the Mercator
// aspect ratio, fitting the bounds into the canvas with letterboxing.
function makeProjector(b, w, h) {
  const lngSpan  = (b.lngMax - b.lngMin) * Math.PI / 180;
  const mercSpan = mercY(b.latMax) - mercY(b.latMin);
  const natural  = lngSpan / mercSpan; // natural w/h in Mercator
  const canvas   = w / h;
  let mapW, mapH, offX, offY;
  if (canvas > natural) {
    // Canvas wider than map: letterbox left/right
    mapH = h; mapW = h * natural; offX = (w - mapW) / 2; offY = 0;
  } else {
    // Canvas taller than map: letterbox top/bottom
    mapW = w; mapH = w / natural; offX = 0; offY = (h - mapH) / 2;
  }
  const mercMin = mercY(b.latMin);
  return (lng, lat) => [
    offX + (lng - b.lngMin) / (b.lngMax - b.lngMin) * mapW,
    offY + (1 - (mercY(lat) - mercMin) / mercSpan) * mapH,
  ];
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
function drawCountries(ctx, topo, proj, w, h, isDark, bounds) {
  const arcs = buildArcs(topo, proj);

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
function drawStates(ctx, topo, proj, w, h, isDark, opacity) {
  if (opacity <= 0 || !topo) return;

  const arcs = buildArcs(topo, proj);

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
function drawRoute(ctx, pts, proj, alpha = 0.55) {
  if (!pts || pts.length < 2) return;
  const xy = pts.map(c => proj(c.lng, c.lat));
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(xy[0][0], xy[0][1]);
  if (pts.length === 2) {
    ctx.lineTo(xy[1][0], xy[1][1]);
  } else {
    // Smooth corners: quadratic bezier with each waypoint as control point,
    // passing through the midpoints between consecutive waypoints.
    ctx.lineTo((xy[0][0] + xy[1][0]) / 2, (xy[0][1] + xy[1][1]) / 2);
    for (let i = 1; i < pts.length - 1; i++) {
      ctx.quadraticCurveTo(xy[i][0], xy[i][1], (xy[i][0] + xy[i+1][0]) / 2, (xy[i][1] + xy[i+1][1]) / 2);
    }
    ctx.lineTo(xy[pts.length - 1][0], xy[pts.length - 1][1]);
  }
  ctx.strokeStyle = '#eb4034';
  ctx.lineWidth = 3;
  ctx.globalAlpha = alpha;
  ctx.stroke();
  ctx.restore();
}

// ── Component ─────────────────────────────────────────────────────────────────
// coords: { lat, lng } | Array<{ lat, lng }> | null
export default function WorldMap({ coords, allCoords = [], allRoutes = [], noZoom = false, onMarkerHover, onMarkerLeave, onMarkerClick }) {
  // Normalise coords to an array (or null) for uniform handling
  const coordsPts = coords ? (Array.isArray(coords) ? coords : [coords]) : null;

  const canvasRef          = useRef(null);
  const activeMarkersRef   = useRef(null);
  const staticMarkersRef   = useRef(null);
  const topoRef            = useRef(null);
  const statesRef          = useRef(null);
  const isDarkRef          = useRef(getIsDark());
  const curBounds          = useRef(WORLD);
  const animFrom           = useRef(WORLD);
  const animTo             = useRef(WORLD);
  const rafRef             = useRef(null);
  const coordsPtsRef       = useRef(coordsPts);
  const allCoordsRef       = useRef(allCoords);
  const allRoutesRef       = useRef(allRoutes);
  const noZoomRef          = useRef(noZoom);
  coordsPtsRef.current   = coordsPts;
  allCoordsRef.current   = allCoords;
  allRoutesRef.current   = allRoutes;
  noZoomRef.current      = noZoom;

  function renderFrame(b) {
    const canvas = canvasRef.current;
    const topo   = topoRef.current;
    const w = canvas ? canvas.offsetWidth : 0;
    const h = canvas ? canvas.offsetHeight : 0;
    const proj = (w && h) ? makeProjector(b, w, h) : null;

    if (canvas && topo && proj) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      drawCountries(ctx, topo, proj, w, h, isDarkRef.current, b);

      // State borders fade in at CA zoom (≈14×) from zoom 5× onward
      const zoom = 360 / (b.lngMax - b.lngMin);
      const stateOpacity = Math.min(1, Math.max(0, (zoom - 5) / 5));
      drawStates(ctx, statesRef.current, proj, w, h, isDarkRef.current, stateOpacity);

      const activePts = coordsPtsRef.current;
      // Background routes: same visibility rule as static markers
      if (!activePts || noZoomRef.current) {
        allRoutesRef.current.forEach((route) => {
          if (route !== activePts) drawRoute(ctx, route, proj, 0.25);
        });
      }
      // Active route on top at full opacity
      if (activePts && activePts.length > 1) drawRoute(ctx, activePts, proj, 0.55);
    }

    if (proj) {
      const activeContainer = activeMarkersRef.current;
      const pts = coordsPtsRef.current;
      if (activeContainer && pts) {
        const children = activeContainer.children;
        for (let i = 0; i < children.length && i < pts.length; i++) {
          const [px, py] = proj(pts[i].lng, pts[i].lat);
          children[i].style.left = `${px / w * 100}%`;
          children[i].style.top  = `${py / h * 100}%`;
        }
      }

      const staticContainer = staticMarkersRef.current;
      if (staticContainer && (!coordsPtsRef.current || noZoomRef.current)) {
        const children = staticContainer.children;
        const allPts = allCoordsRef.current;
        for (let i = 0; i < children.length && i < allPts.length; i++) {
          const [px, py] = proj(allPts[i].lng, allPts[i].lat);
          children[i].style.left = `${px / w * 100}%`;
          children[i].style.top  = `${py / h * 100}%`;
        }
      }
    }
  }

  // Initial CSS position for a marker — corrected on the first renderFrame tick.
  function pct(lng, lat) {
    const w = canvasRef.current?.offsetWidth || 400;
    const h = canvasRef.current?.offsetHeight || 260;
    const [px, py] = makeProjector(curBounds.current, w, h)(lng, lat);
    return { left: `${px / w * 100}%`, top: `${py / h * 100}%` };
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
    isDarkRef.current = getIsDark();

    const mo = new MutationObserver(() => { isDarkRef.current = getIsDark(); renderFrame(curBounds.current); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    fetchGeo().then((topo) => { topoRef.current = topo; renderFrame(curBounds.current); });
    fetchStates().then((s) => { statesRef.current = s; renderFrame(curBounds.current); });

    const ro = new ResizeObserver(() => renderFrame(curBounds.current));
    if (canvasRef.current) ro.observe(canvasRef.current);

    return () => {
      mo.disconnect();
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
          {coordsPts.map((c, i) => {
            const isMid = coordsPts.length > 1 && i > 0 && i < coordsPts.length - 1;
            return (
              <div key={i} className={`map-marker${isMid ? ' map-marker-mid' : ''}`} style={pct(c.lng, c.lat)}>
                {coordsPts.length === 1 && <div className="map-marker-pulse" />}
                <div className="map-marker-dot" />
              </div>
            );
          })}
        </div>
      )}
      {(!coordsPts || noZoom) && (
        <div ref={staticMarkersRef} aria-hidden="true">
          {allCoords.map((c, i) => (
            <div
              key={i}
              className="map-marker map-marker-static"
              style={pct(c.lng, c.lat)}
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
