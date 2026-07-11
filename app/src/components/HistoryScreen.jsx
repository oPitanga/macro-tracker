import { useState } from 'react';
import { lastNDates, daySummary, shortDayLabel } from '../lib/calc';
import BarChartCard from './BarChartCard';
import MetricLineChart from './MetricLineChart';

const MUTED = 'rgba(245,246,247,0.25)';

function isWithinGoal(value, goal) {
  return goal > 0 ? Math.abs(value - goal) / goal <= 0.1 : true;
}

function shortMonthDay(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function HistoryScreen({ log, foods, goals, todayStr, bodyLog, onLogBody, onRemoveBody }) {
  const [macrosOpen, setMacrosOpen] = useState(false);
  const [bodyDate, setBodyDate] = useState(todayStr);
  const [weightDraft, setWeightDraft] = useState('');
  const [fatDraft, setFatDraft] = useState('');

  const dates = lastNDates(7, todayStr);
  const days = dates.map((d) => daySummary(d, log, foods));

  const maxCal = Math.max(...days.map((d) => d.calories), goals.calories, 1);
  const calorieDays = days.map((d) => ({
    dayLabel: shortDayLabel(d.date, todayStr),
    valueLabel: String(d.calories),
    barHeight: Math.max(6, Math.round((d.calories / maxCal) * 110)),
    barColor: isWithinGoal(d.calories, goals.calories) ? 'var(--accent)' : 'var(--protein)',
  }));

  const macroChart = (key, goal, color) => {
    const maxV = Math.max(...days.map((d) => d[key]), goal, 1);
    return days.map((d) => ({
      dayLabel: shortDayLabel(d.date, todayStr),
      valueLabel: String(Math.round(d[key])),
      barHeight: Math.max(6, Math.round((d[key] / maxV) * 110)),
      barColor: isWithinGoal(d[key], goal) ? color : MUTED,
    }));
  };

  const proteinDays = macroChart('protein', goals.protein, 'var(--protein)');
  const carbsDays = macroChart('carbs', goals.carbs, 'var(--carbs)');
  const fatDays = macroChart('fat', goals.fat, 'var(--fat)');

  const recentBody = bodyLog.slice(-8);
  const bodyPoints = recentBody.map((e) => ({
    label: shortMonthDay(e.date),
    weight: e.weight,
    bodyFat: e.bodyFat,
  }));
  const hasBody = bodyPoints.length > 0;

  const canSaveBody = weightDraft.trim() !== '' || fatDraft.trim() !== '';
  function saveBody() {
    if (!canSaveBody) return;
    const weight = weightDraft.trim() !== '' ? parseFloat(weightDraft) : null;
    const bodyFat = fatDraft.trim() !== '' ? parseFloat(fatDraft) : null;
    onLogBody({ date: bodyDate, weight, bodyFat });
    setWeightDraft('');
    setFatDraft('');
  }

  return (
    <div className="screen">
      <div className="page-head">
        <div className="page-title">History</div>
        <div className="page-subtitle">Last 7 days vs your goal</div>
      </div>
      <div className="screen-scroll" style={{ padding: '16px 20px 110px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BarChartCard title="Calories" days={calorieDays} height={140} legend />

        {/* Collapsible macros section */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', flexShrink: 0 }}>
          <button
            onClick={() => setMacrosOpen((o) => !o)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '16px 16px' }}
          >
            <span style={{ font: "700 15px 'Space Grotesk'", color: 'var(--text)' }}>Macros</span>
            <span style={{ font: '600 13px Manrope', color: 'var(--text-50)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {macrosOpen ? 'Hide' : 'Show'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: macrosOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
                <path d="M6 9l6 6 6-6" stroke="var(--text-50)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          {macrosOpen && (
            <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <BarChartCard title="Protein" titleColor="var(--protein)" days={proteinDays} height={100} bare />
              <BarChartCard title="Carbs" titleColor="var(--carbs)" days={carbsDays} height={100} bare />
              <BarChartCard title="Fat" titleColor="var(--fat)" days={fatDays} height={100} bare />
            </div>
          )}
        </div>

        {/* Body metrics section */}
        <div className="card">
          <div style={{ font: "700 15px 'Space Grotesk'", marginBottom: 4 }}>Body</div>
          <div style={{ font: '500 12px Manrope', color: 'var(--text-50)', marginBottom: 14 }}>Log weight & body fat over time</div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div className="field-label">DATE</div>
              <input type="date" value={bodyDate} max={todayStr} onChange={(e) => setBodyDate(e.target.value)} className="text-input text-input--form" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="field-label" style={{ color: 'var(--accent)' }}>WEIGHT (KG)</div>
              <input type="number" inputMode="decimal" value={weightDraft} onChange={(e) => setWeightDraft(e.target.value)} placeholder="—" className="text-input text-input--form" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="field-label" style={{ color: 'var(--fat)' }}>BODY FAT (%)</div>
              <input type="number" inputMode="decimal" value={fatDraft} onChange={(e) => setFatDraft(e.target.value)} placeholder="—" className="text-input text-input--form" />
            </div>
          </div>
          <button
            onClick={saveBody}
            disabled={!canSaveBody}
            className="btn-primary"
            style={{ width: '100%', background: canSaveBody ? 'var(--accent)' : 'var(--accent-dim)' }}
          >Save Entry</button>

          {hasBody ? (
            <div style={{ marginTop: 16 }}>
              <MetricLineChart points={bodyPoints} weightColor="var(--accent)" fatColor="var(--fat)" />
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)' }} />
                <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>Weight</div>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--fat)', marginLeft: 10 }} />
                <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>Body fat %</div>
              </div>

              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[...bodyLog].reverse().map((e) => (
                  <div key={e.date} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ flex: 1, font: '600 13px Manrope' }}>{shortMonthDay(e.date)}</div>
                    <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>
                      {e.weight != null && <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{e.weight}kg</span>}
                      {e.weight != null && e.bodyFat != null && <span style={{ margin: '0 6px' }}>·</span>}
                      {e.bodyFat != null && <span style={{ color: 'var(--fat)', fontWeight: 700 }}>{e.bodyFat}%</span>}
                    </div>
                    <button
                      onClick={() => onRemoveBody(e.date)}
                      style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.07)', color: 'var(--text-60)', font: '600 14px Manrope', cursor: 'pointer', flexShrink: 0 }}
                    >×</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-note" style={{ marginTop: 12 }}>No weigh-ins logged yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
