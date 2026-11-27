import { useEffect, useRef } from 'react';
import {
  ascending, bisectCenter, format, line, median, pointer, range,
  scaleLinear, scaleUtc, select, utcDay, utcFormat, utcMonth, utcParse,
} from 'd3';
import { SALES, DRAM } from './macStudioResaleData.js';
import './MacStudioResaleChart.css';

const parse = utcParse('%Y-%m-%d');
const DAY = 864e5;
const PULLED = +parse('2026-03-04');
const EVENTS = [
  { d: '2025-03-12', n: 'M3 Ultra 512GB ships', s: 'M3 Ultra 512GB ships', row: 0 },
  { d: '2026-03-04', n: '512GB option pulled', s: '512GB pulled', row: 0 },
  { d: '2026-08-25', n: 'M5 Ultra 512GB announced', s: 'M5 Ultra 512GB announced', row: 1 },
];
const usd = v => '$' + format(',.0f')(v);
const fmtD = utcFormat('%b %-d, %Y');

// Weekly rolling median of sales within ±45 days. Windows never straddle the
// date the 512GB option was pulled, since the market changed at that point.
const POINTS = (() => {
  const sp = SALES.map(r => ({ t: +parse(r.d), p: r.p }));
  const pts = [];
  for (let t = +parse('2025-05-27'); t <= +parse('2026-11-25'); t += 7 * DAY) {
    const w = sp
      .filter(x => x.t > t - 45 * DAY && x.t <= t + 45 * DAY && (x.t < PULLED) === (t < PULLED))
      .map(x => x.p)
      .sort(ascending);
    if (w.length) pts.push({ t: new Date(t), n: w.length, med: Math.round(median(w)) });
  }
  return pts;
})();
const DRAM_POINTS = DRAM.map(d => ({ t: parse(d.d), v: Math.round(d.c * 256) }));

function draw(el) {
  el.replaceChildren();
  const css = getComputedStyle(el);
  const col = n => css.getPropertyValue(n).trim();
  const W = el.clientWidth, H = el.clientHeight, small = W < 520;
  const m = { top: 30, right: 12, bottom: 28, left: 46 };
  const x0 = parse('2025-02-01'), x1 = parse('2026-12-15'), m5d = parse('2026-10-28');
  const m5Label = small ? 'M5 512GB orders open' : 'M5 Ultra 512GB orders open';

  // Widen the right margin so the M5 reference label never clips.
  {
    const probe = select(el).append('svg').append('text').text(m5Label);
    const lw = probe.node().getComputedTextLength();
    probe.node().parentNode.remove();
    const sh = (x1 - m5d) / (x1 - x0);
    m.right = Math.max(12, Math.ceil((lw + 8 - (W - m.left) * sh) / (1 - sh)));
  }

  const x = scaleUtc([x0, x1], [m.left, W - m.right]);
  const y = scaleLinear([0, 34000], [H - m.bottom, m.top]);
  const yt = range(0, 30001, 5000);
  const svg = select(el).append('svg').attr('aria-hidden', 'true');

  svg.append('g').selectAll('line').data(yt).join('line')
    .attr('x1', m.left).attr('x2', W - m.right).attr('y1', y).attr('y2', y).attr('stroke', col('--mc-grid'));
  svg.append('g').selectAll('text').data(yt).join('text')
    .attr('x', m.left - 8).attr('y', v => y(v) + 4).attr('text-anchor', 'end')
    .text(v => (v ? '$' + v / 1000 + 'k' : '$0'));
  svg.append('g').selectAll('text').data(x.ticks(utcMonth.every(small ? 6 : 3))).join('text')
    .attr('x', x).attr('y', H - 8).attr('text-anchor', 'middle').text(utcFormat("%b '%y"));
  svg.append('line').attr('x1', m.left).attr('x2', W - m.right).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', col('--mc-axis'));

  for (const e of EVENTS) {
    const px = x(parse(e.d)), ty = m.top + 4 + e.row * 20;
    svg.append('line').attr('x1', px).attr('x2', px).attr('y1', ty - 12).attr('y2', y(0))
      .attr('stroke', col('--mc-axis')).attr('stroke-dasharray', '2 3');
    svg.append('text').attr('class', 'mac-chart-halo').attr('x', px + 5).attr('y', ty)
      .style('fill', col('--mc-fg')).text(small ? e.s : e.n);
  }

  const refs = [
    { a: parse('2025-03-12'), b: PULLED, v: 9499, l: 'M3 Ultra 512GB orders open: $9,499' },
    { a: m5d, b: x1, v: 22299, l: m5Label },
  ];
  for (const f of refs) {
    svg.append('line').attr('x1', x(f.a)).attr('x2', x(f.b)).attr('y1', y(f.v)).attr('y2', y(f.v))
      .attr('stroke', col('--mc-ref')).attr('stroke-width', 1.5).attr('stroke-dasharray', '5 4');
  }
  for (const f of refs) {
    svg.append('text').attr('class', 'mac-chart-halo').attr('x', x(f.a) + 4).attr('y', y(f.v) - 7).text(f.l);
  }

  const dp = DRAM_POINTS.filter(d => d.t >= x0);
  svg.append('path').datum(dp).attr('d', line().x(d => x(d.t)).y(d => y(d.v)))
    .attr('fill', 'none').attr('stroke', col('--mc-orange')).attr('stroke-width', 2.5).attr('stroke-linejoin', 'round');
  svg.append('path').datum(POINTS).attr('d', line().x(d => x(d.t)).y(d => y(d.med)))
    .attr('fill', 'none').attr('stroke', col('--mc-blue')).attr('stroke-width', 2.5).attr('stroke-linejoin', 'round');
  const last = POINTS[POINTS.length - 1];
  svg.append('circle').attr('cx', x(last.t)).attr('cy', y(last.med)).attr('r', 4)
    .attr('fill', col('--mc-blue')).attr('stroke', col('--mc-bg')).attr('stroke-width', 2);

  const tip = document.createElement('div');
  tip.className = 'mac-chart-tip';
  tip.hidden = true;
  el.append(tip);
  const dot = svg.append('circle').attr('r', 5).attr('fill', col('--mc-blue'))
    .attr('stroke', col('--mc-bg')).attr('stroke-width', 2).style('display', 'none');
  const ptT = POINTS.map(p => +p.t), dpT = dp.map(p => +p.t);
  const hide = () => { tip.hidden = true; dot.style('display', 'none'); };

  svg.append('rect').attr('x', m.left).attr('y', m.top)
    .attr('width', W - m.left - m.right).attr('height', H - m.top - m.bottom)
    .attr('fill', 'transparent').style('pointer-events', 'all')
    .on('pointermove', e => {
      const t = x.invert(pointer(e)[0]);
      if (t < utcDay.offset(POINTS[0].t, -10)) return hide();
      const d = POINTS[bisectCenter(ptT, +t)], q = dp[bisectCenter(dpT, +t)];
      dot.style('display', null).attr('cx', x(d.t)).attr('cy', y(d.med));
      tip.replaceChildren();
      const add = (s, bold) => {
        const n = document.createElement(bold ? 'b' : 'div');
        n.textContent = s;
        tip.append(n);
      };
      add(usd(d.med) + ' median resale', true);
      add('Sales ' + fmtD(utcDay.offset(d.t, -45)) + ' – ' + fmtD(utcDay.offset(d.t, 45)));
      add(d.n + ' sales in window');
      const gap = document.createElement('div');
      gap.style.marginTop = '6px';
      tip.append(gap);
      add(usd(q.v) + ' DRAM spot value', true);
      add('Spot reading ' + fmtD(q.t));
      tip.hidden = false;
      const tw = tip.offsetWidth;
      tip.style.left = Math.min(Math.max(0, x(d.t) - tw / 2), W - tw) + 'px';
      tip.style.top = Math.max(0, y(Math.max(d.med, q.v)) - tip.offsetHeight - 14) + 'px';
    })
    .on('pointerleave', hide);
}

export default function MacStudioResaleChart() {
  const figRef = useRef(null);

  // Client-only: SSR emits the empty, fixed-height figure plus legend.
  useEffect(() => {
    const el = figRef.current;
    const redraw = () => draw(el);
    redraw();
    const ro = new ResizeObserver(redraw);
    ro.observe(el);
    // Site dark mode is a data-theme attribute on <html>, not a media query.
    const mo = new MutationObserver(redraw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => { ro.disconnect(); mo.disconnect(); };
  }, []);

  return (
    <figure className="mac-chart">
      <div
        ref={figRef}
        className="mac-chart-fig"
        role="img"
        aria-label="Median eBay resale price of the M3 Ultra 512GB Mac Studio compared with the spot value of 512GB of DRAM, 2025 to 2026."
      />
      <ul className="mac-chart-legend">
        <li><span className="mac-chart-sw" style={{ background: 'var(--mc-blue)' }} />M3 Ultra 512GB median resale price (eBay, 90-day window)</li>
        <li><span className="mac-chart-sw" style={{ background: 'var(--mc-orange)' }} />Spot value of 512GB DRAM</li>
      </ul>
    </figure>
  );
}
