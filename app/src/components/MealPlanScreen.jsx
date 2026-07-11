import { MEAL_TYPES, MEAL_LABELS, DAYS, DAY_SHORT_LABELS } from '../lib/seed';
import { entryMacros, planMealMacros } from '../lib/calc';

export default function MealPlanScreen({
  foods, mealPlan, todayDayKey,
  planDay, onSelectDay, planMeal, onSelectMeal,
  planQuery, onPlanQueryChange,
  expandedFoodId, onToggleExpand,
  qtyDrafts, onQtyChange,
  onAdd, onRemoveEntry,
  planAddDays, onTogglePlanAddDay, onToggleAllPlanAddDays,
}) {
  const q = planQuery.trim().toLowerCase();
  const filtered = foods.filter((f) => f.name.toLowerCase().includes(q));

  const plannedEntries = (mealPlan[planDay]?.[planMeal] || []).map((e) => ({ ...entryMacros(e, foods), id: e.id }));
  const totals = planMealMacros(planDay, planMeal, mealPlan, foods);

  return (
    <div className="screen">
      <div className="page-head page-head--tight">
        <div className="page-title">Meal Plan</div>
        <div className="page-subtitle">Plan what you'll eat this week</div>
      </div>

      <div style={{ padding: '4px 16px 10px', display: 'flex', gap: 6, flexShrink: 0, overflowX: 'auto' }}>
        {DAYS.map((day) => {
          const active = planDay === day;
          const isToday = day === todayDayKey;
          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              style={{
                flex: '0 0 auto', minWidth: 44, padding: '8px 0', borderRadius: 12,
                border: isToday && !active ? '1px solid var(--accent-dim)' : '1px solid var(--border-input)',
                background: active ? 'var(--accent)' : 'var(--bg-card)',
                color: active ? '#121316' : 'var(--text-60)',
                font: '700 12px Manrope', cursor: 'pointer',
              }}
            >{DAY_SHORT_LABELS[day]}</button>
          );
        })}
      </div>

      <div style={{ padding: '0 16px 10px', display: 'flex', gap: 8, flexShrink: 0 }}>
        {MEAL_TYPES.map((meal) => {
          const active = planMeal === meal;
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

      <div className="screen-scroll" style={{ padding: '0 16px 110px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card-16">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ font: "700 14px 'Space Grotesk'" }}>Planned total</div>
            <div style={{ font: "700 14px 'Space Grotesk'", color: 'var(--accent)' }}>{totals.cal} kcal</div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>P <span style={{ color: 'var(--protein)', fontWeight: 700 }}>{totals.protein}g</span></div>
            <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>C <span style={{ color: 'var(--carbs)', fontWeight: 700 }}>{totals.carbs}g</span></div>
            <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>F <span style={{ color: 'var(--fat)', fontWeight: 700 }}>{totals.fat}g</span></div>
          </div>
        </div>

        <div>
          <div style={{ font: "700 15px 'Space Grotesk'", marginBottom: 8 }}>Planned items</div>
          {plannedEntries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {plannedEntries.map((e) => (
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
            <div className="empty-note">Nothing planned yet</div>
          )}
        </div>

        <div>
          <div style={{ font: "700 15px 'Space Grotesk'", marginBottom: 8 }}>Add from library</div>

          <div style={{ font: '600 12px Manrope', color: 'var(--text-45)', marginBottom: 6 }}>Add to</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <button
              onClick={onToggleAllPlanAddDays}
              style={{
                flex: '0 0 auto', padding: '7px 10px', borderRadius: 10,
                border: '1px solid var(--border-input)',
                background: planAddDays.length === DAYS.length ? 'var(--accent)' : 'var(--bg-card)',
                color: planAddDays.length === DAYS.length ? '#121316' : 'var(--text-60)',
                font: '700 12px Manrope', cursor: 'pointer',
              }}
            >Every day</button>
            {DAYS.map((day) => {
              const active = planAddDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => onTogglePlanAddDay(day)}
                  style={{
                    flex: '0 0 auto', padding: '7px 10px', borderRadius: 10,
                    border: '1px solid var(--border-input)',
                    background: active ? 'var(--accent)' : 'var(--bg-card)',
                    color: active ? '#121316' : 'var(--text-60)',
                    font: '700 12px Manrope', cursor: 'pointer',
                  }}
                >{DAY_SHORT_LABELS[day]}</button>
              );
            })}
          </div>

          <input
            type="text"
            value={planQuery}
            onChange={(e) => onPlanQueryChange(e.target.value)}
            placeholder="Search food library…"
            className="text-input"
            style={{ marginBottom: 8 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((f) => {
              const expanded = expandedFoodId === f.id;
              return (
                <div key={f.id} className="card-16">
                  <div
                    onClick={() => onToggleExpand(f.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  >
                    <div>
                      <div style={{ font: '600 14px Manrope' }}>{f.name}</div>
                      <div style={{ font: '500 12px Manrope', color: 'var(--text-45)', marginTop: 2 }}>
                        {f.calories} kcal · P{f.protein} C{f.carbs} F{f.fat} per {f.servingSize}{f.servingUnit}
                      </div>
                    </div>
                    <div style={{ font: "700 13px 'Space Grotesk'", color: 'var(--text-60)' }}>{expanded ? '−' : '+'}</div>
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
                      >{planAddDays.length > 1 ? `Add to ${planAddDays.length} days` : 'Add'}</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
