import { entryMacros, pct, round1 } from '../lib/calc';
import { MEAL_TYPES, MEAL_LABELS } from '../lib/seed';

function MacroTile({ label, color, consumed, goal, pctVal }) {
  return (
    <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 12px' }}>
      <div style={{ font: '600 11px Manrope', color, letterSpacing: '.03em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ font: "700 20px 'Space Grotesk'", marginTop: 4 }}>
        {consumed}
        <span style={{ font: '500 12px Manrope', color: 'var(--text-40)' }}> / {goal}g</span>
      </div>
      <div style={{ marginTop: 8, height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 4, background: color, width: `${pctVal}%` }} />
      </div>
    </div>
  );
}

export default function TodayScreen({ todayLabel, goals, log, foods, todayStr, onRemoveEntry, onLogFood }) {
  const todayEntries = log.filter((e) => e.date === todayStr);

  let calConsumed = 0, proteinConsumed = 0, carbsConsumed = 0, fatConsumed = 0;
  todayEntries.forEach((e) => {
    const m = entryMacros(e, foods);
    calConsumed += m.cal; proteinConsumed += m.protein; carbsConsumed += m.carbs; fatConsumed += m.fat;
  });
  calConsumed = Math.round(calConsumed);
  proteinConsumed = round1(proteinConsumed);
  carbsConsumed = round1(carbsConsumed);
  fatConsumed = round1(fatConsumed);

  const calRemaining = Math.max(0, Math.round(goals.calories - calConsumed));
  const calPct = pct(calConsumed, goals.calories);

  const mealGroups = MEAL_TYPES.map((meal) => {
    const entries = todayEntries
      .filter((e) => e.meal === meal)
      .map((e) => ({ ...entryMacros(e, foods), id: e.id }));
    const totalCal = entries.reduce((a, e) => a + e.cal, 0);
    return { meal, label: MEAL_LABELS[meal], entries, totalCal };
  });

  return (
    <div className="screen">
      <div className="page-head">
        <div className="eyebrow">{todayLabel}</div>
        <div className="page-title">Today</div>
      </div>

      <div className="screen-scroll" style={{ padding: '16px 20px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <div style={{ font: "700 40px 'Space Grotesk'", color: 'var(--accent)', lineHeight: 1 }}>{calRemaining}</div>
              <div style={{ font: '500 13px Manrope', color: 'var(--text-55)', marginTop: 6 }}>kcal remaining</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ font: "600 15px 'Space Grotesk'" }}>{calConsumed} / {goals.calories}</div>
              <div style={{ font: '500 12px Manrope', color: 'var(--text-40)', marginTop: 2 }}>consumed / goal</div>
            </div>
          </div>
          <div style={{ marginTop: 14, height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 6, background: 'var(--accent)', width: `${calPct}%` }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <MacroTile label="Protein" color="var(--protein)" consumed={proteinConsumed} goal={goals.protein} pctVal={pct(proteinConsumed, goals.protein)} />
          <MacroTile label="Carbs" color="var(--carbs)" consumed={carbsConsumed} goal={goals.carbs} pctVal={pct(carbsConsumed, goals.carbs)} />
          <MacroTile label="Fat" color="var(--fat)" consumed={fatConsumed} goal={goals.fat} pctVal={pct(fatConsumed, goals.fat)} />
        </div>

        {mealGroups.map((mg) => (
          <div key={mg.meal}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ font: "700 15px 'Space Grotesk'" }}>{mg.label}</div>
              <div style={{ font: '600 13px Manrope', color: 'var(--text-45)' }}>{mg.totalCal} kcal</div>
            </div>
            {mg.entries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
                {mg.entries.map((e) => (
                  <div key={e.id} className="card-16" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: '600 14px Manrope', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</div>
                      <div style={{ font: '500 12px Manrope', color: 'var(--text-45)', marginTop: 2 }}>{e.qtyLabel} · {e.cal} kcal</div>
                    </div>
                    <button
                      onClick={() => onRemoveEntry(e.id)}
                      style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.07)', color: 'var(--text-60)', font: '600 15px Manrope', cursor: 'pointer', flexShrink: 0 }}
                    >×</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-note">No items logged</div>
            )}
          </div>
        ))}
      </div>

      <button className="fab" onClick={onLogFood}>+</button>
    </div>
  );
}
