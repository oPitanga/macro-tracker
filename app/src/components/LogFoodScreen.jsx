import { MEAL_TYPES, MEAL_LABELS } from '../lib/seed';

export default function LogFoodScreen({
  foods, logMeal, onSelectMeal, logQuery, onLogQueryChange,
  starredByMeal, onToggleStar, expandedFoodId, onToggleExpand,
  qtyDrafts, onQtyChange, onAdd, onBack,
}) {
  const q = logQuery.trim().toLowerCase();
  const starredIds = starredByMeal[logMeal] || [];
  const isStarred = (id) => starredIds.includes(id);

  const filtered = foods
    .filter((f) => f.name.toLowerCase().includes(q))
    .slice()
    .sort((a, b) => (isStarred(a.id) ? 0 : 1) - (isStarred(b.id) ? 0 : 1));

  return (
    <div className="screen">
      <div className="back-head">
        <button className="icon-btn" onClick={onBack}>←</button>
        <div className="back-title">Log Food</div>
      </div>

      <div style={{ padding: '4px 16px 10px', display: 'flex', gap: 8, flexShrink: 0 }}>
        {MEAL_TYPES.map((meal) => {
          const active = logMeal === meal;
          return (
            <button
              key={meal}
              onClick={() => onSelectMeal(meal)}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 12, border: '1px solid var(--border-input)',
                background: active ? 'var(--accent)' : 'var(--bg-card)',
                color: active ? '#121316' : 'var(--text-60)',
                font: '600 13px Manrope', cursor: 'pointer',
              }}
            >{MEAL_LABELS[meal]}</button>
          );
        })}
      </div>

      <div style={{ padding: '0 16px 10px', flexShrink: 0 }}>
        <input
          type="text"
          value={logQuery}
          onChange={(e) => onLogQueryChange(e.target.value)}
          placeholder="Search food library…"
          className="text-input"
        />
      </div>

      <div className="screen-scroll" style={{ padding: '0 16px 110px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((f) => {
          const expanded = expandedFoodId === f.id;
          const starred = isStarred(f.id);
          return (
            <div key={f.id} className="card-16">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => onToggleStar(logMeal, f.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: 22, height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.3l7.1-.7L12 2z"
                      fill={starred ? 'var(--accent)' : 'none'}
                      stroke={starred ? 'var(--accent)' : 'var(--text-40)'}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  onClick={() => onToggleExpand(f.id)}
                  style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ font: '600 14px Manrope' }}>{f.name}</div>
                    <div style={{ font: '500 12px Manrope', color: 'var(--text-45)', marginTop: 2 }}>
                      {f.calories} kcal · P{f.protein} C{f.carbs} F{f.fat} per {f.servingSize}{f.servingUnit}
                    </div>
                  </div>
                  <div style={{ font: "700 13px 'Space Grotesk'", color: 'var(--text-60)' }}>{expanded ? '−' : '+'}</div>
                </div>
              </div>
              {expanded && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                  <input
                    type="number"
                    value={qtyDrafts[f.id] ?? String(f.servingSize)}
                    onChange={(e) => onQtyChange(f.id, e.target.value)}
                    style={{ width: 84, background: 'var(--bg-input)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '9px 10px', color: 'var(--text)', font: '600 14px Manrope', outline: 'none' }}
                  />
                  <div style={{ font: '500 13px Manrope', color: 'var(--text-45)' }}>{f.servingUnit}</div>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={() => onAdd(f.id)}
                    style={{ padding: '9px 16px', borderRadius: 10, border: 'none', background: 'var(--accent)', color: '#121316', font: '700 13px Manrope', cursor: 'pointer' }}
                  >Add</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
