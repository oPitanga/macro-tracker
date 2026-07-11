// Dual-axis line chart: weight on the left scale, body-fat % on the right scale,
// drawn on the same plot. Each series is optional and may contain gaps (nulls).
const W = 320, H = 176;
const padL = 30, padR = 34, padT = 16, padB = 30;
const plotW = W - padL - padR;
const plotH = H - padT - padB;

function niceRange(values) {
  const vals = values.filter((v) => v != null);
  if (vals.length === 0) return null;
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.15;
  return { min: min - pad, max: max + pad };
}

function xAt(i, n) {
  return padL + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2);
}

function yAt(v, range) {
  return padT + (1 - (v - range.min) / (range.max - range.min)) * plotH;
}

/** Builds SVG path data for a series, breaking the line across null gaps. */
function pathFor(points, key, range) {
  const n = points.length;
  let d = '';
  let penDown = false;
  points.forEach((p, i) => {
    const v = p[key];
    if (v == null) { penDown = false; return; }
    const cmd = penDown ? 'L' : 'M';
    d += `${cmd}${xAt(i, n).toFixed(1)} ${yAt(v, range).toFixed(1)} `;
    penDown = true;
  });
  return d.trim();
}

export default function MetricLineChart({ points, weightColor, fatColor }) {
  const n = points.length;
  const weightRange = niceRange(points.map((p) => p.weight));
  const fatRange = niceRange(points.map((p) => p.bodyFat));

  const fmt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* baseline */}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      {/* left axis (weight) min/max labels */}
      {weightRange && (
        <>
          <text x={padL - 6} y={padT + 4} textAnchor="end" fill={weightColor} style={{ font: "600 9px 'Space Grotesk'" }}>{fmt(weightRange.max)}</text>
          <text x={padL - 6} y={padT + plotH} textAnchor="end" fill={weightColor} style={{ font: "600 9px 'Space Grotesk'" }}>{fmt(weightRange.min)}</text>
        </>
      )}
      {/* right axis (body fat) min/max labels */}
      {fatRange && (
        <>
          <text x={padL + plotW + 6} y={padT + 4} textAnchor="start" fill={fatColor} style={{ font: "600 9px 'Space Grotesk'" }}>{fmt(fatRange.max)}</text>
          <text x={padL + plotW + 6} y={padT + plotH} textAnchor="start" fill={fatColor} style={{ font: "600 9px 'Space Grotesk'" }}>{fmt(fatRange.min)}</text>
        </>
      )}

      {/* weight line + dots */}
      {weightRange && (
        <>
          <path d={pathFor(points, 'weight', weightRange)} fill="none" stroke={weightColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => p.weight != null && (
            <circle key={`w${i}`} cx={xAt(i, n)} cy={yAt(p.weight, weightRange)} r="2.6" fill={weightColor} />
          ))}
        </>
      )}
      {/* body fat line + dots */}
      {fatRange && (
        <>
          <path d={pathFor(points, 'bodyFat', fatRange)} fill="none" stroke={fatColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => p.bodyFat != null && (
            <circle key={`f${i}`} cx={xAt(i, n)} cy={yAt(p.bodyFat, fatRange)} r="2.6" fill={fatColor} />
          ))}
        </>
      )}

      {/* x labels */}
      {points.map((p, i) => (
        <text key={`x${i}`} x={xAt(i, n)} y={H - 10} textAnchor="middle" fill="var(--text-55)" style={{ font: '600 9px Manrope' }}>{p.label}</text>
      ))}
    </svg>
  );
}
