import { useState, useRef, useEffect, useCallback } from 'react';

// ── Hex grid layout: 4-5-4 arrangement (equal-size hexes, not geographic) ──────
// R = 50, col-spacing = √3·R ≈ 86.6, row-spacing = 1.5·R = 75
// Odd rows (row 1) are offset right by √3·R/2 ≈ 43.3
// ViewBox 0 0 470 270

const R = 50;

const HEX_LAYOUT = [
  // Row 0 (y=60) — 4 hexes
  { id: 'ON',  name: 'Ontario',                   x: 103, y: 60 },
  { id: 'NU',  name: 'Nunavut',                   x: 190, y: 60 },
  { id: 'BC',  name: 'British Columbia',          x: 277, y: 60 },
  { id: 'NT',  name: 'Northwest Territories',     x: 364, y: 60 },
  // Row 1 (y=135) — 5 hexes, offset right
  { id: 'AB',  name: 'Alberta',                   x: 60,  y: 135 },
  { id: 'QC',  name: 'Quebec',                    x: 147, y: 135 },
  { id: 'MB',  name: 'Manitoba',                  x: 234, y: 135 },
  { id: 'YT',  name: 'Yukon',                     x: 320, y: 135 },
  { id: 'NS',  name: 'Nova Scotia',               x: 407, y: 135 },
  // Row 2 (y=210) — 4 hexes
  { id: 'SK',  name: 'Saskatchewan',              x: 103, y: 210 },
  { id: 'NB',  name: 'New Brunswick',             x: 190, y: 210 },
  { id: 'NL',  name: 'Newfoundland and Labrador', x: 277, y: 210 },
  { id: 'PEI', name: 'Prince Edward Island',      x: 364, y: 210 },
];

const NAME_TO_CODE = {
  Ontario: 'ON', 'British Columbia': 'BC', Alberta: 'AB', Quebec: 'QC',
  Manitoba: 'MB', 'Nova Scotia': 'NS', Saskatchewan: 'SK', Nunavut: 'NU',
  'New Brunswick': 'NB', 'Newfoundland and Labrador': 'NL',
  'Northwest Territories': 'NT', 'Prince Edward Island': 'PEI', Yukon: 'YT',
};

function hexPoints(cx, cy, r) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (90 - 60 * k) * Math.PI / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy - r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

function getColor(count, maxCount) {
  if (count === 0) return 'hsl(263,12%,95%)';
  const t = Math.sqrt(count / maxCount); // sqrt for perceptual fairness
  const l = Math.round(90 - t * 52);
  const s = Math.round(18 + t * 50);
  return `hsl(263,${s}%,${l}%)`;
}

function getTextColor(count, maxCount) {
  const t = Math.sqrt(count / maxCount);
  return t > 0.55 ? 'rgba(255,255,255,0.95)' : 'rgba(12,9,19,0.75)';
}

export default function CanadaMap({ data = {} }) {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const byCode = Object.fromEntries(
    Object.entries(data).map(([name, count]) => [NAME_TO_CODE[name] || name, count])
  );
  const maxCount = Math.max(...Object.values(byCode), 1);

  const handleMouseMove = useCallback((e, id, name) => {
    setTooltip({ name, count: byCode[id] || 0, x: e.clientX, y: e.clientY });
  }, [byCode]);

  return (
    <div ref={wrapRef} className="hex-wrap">
      <svg
        viewBox="0 0 470 270"
        className="hex-svg"
        aria-label="Hexagonal grid of Canadian provinces and territories by participant count"
      >
        {HEX_LAYOUT.map(({ id, name, x, y }, i) => {
          const count = byCode[id] || 0;
          const fill = getColor(count, maxCount);
          const textFill = getTextColor(count, maxCount);

          return (
            <g
              key={id}
              className={`hex-cell${visible ? ' hex-cell--in' : ''}`}
              style={{ '--hex-delay': `${i * 45}ms` }}
              onMouseMove={(e) => handleMouseMove(e, id, name)}
              onMouseLeave={() => setTooltip(null)}
              aria-label={`${name}: ${count.toLocaleString()} participants`}
            >
              <polygon
                points={hexPoints(x, y, R - 3)}
                fill={fill}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.5"
              />
              <text x={x} y={count > 0 ? y - 9 : y} textAnchor="middle"
                className="hex-code" fill={textFill}>
                {id}
              </text>
              {count > 0 && (
                <text x={x} y={y + 11} textAnchor="middle"
                  className="hex-count" fill={textFill}>
                  {count.toLocaleString()}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="hex-legend">
        <div className="hex-legend-bar" />
        <div className="hex-legend-labels">
          <span>Fewer</span>
          <span>More participants</span>
        </div>
      </div>

      {tooltip && (
        <div
          className="cm-tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y - 58, position: 'fixed', pointerEvents: 'none' }}
        >
          <div className="cm-tt-name">{tooltip.name}</div>
          <div className="cm-tt-count">
            {tooltip.count > 0 ? `${tooltip.count.toLocaleString()} participants` : 'No data'}
          </div>
        </div>
      )}
    </div>
  );
}
