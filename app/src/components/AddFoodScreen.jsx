import { caloriesFromMacros } from '../lib/calc';

export default function AddFoodScreen({ newFood, editing, onChange, onSave, onBack }) {
  const invalid = !newFood.name.trim();
  const calories = caloriesFromMacros(newFood.protein, newFood.carbs, newFood.fat);

  return (
    <div className="screen">
      <div className="back-head">
        <button className="icon-btn" onClick={onBack}>←</button>
        <div className="back-title">{editing ? 'Edit Food' : 'New Food'}</div>
      </div>
      <div className="screen-scroll" style={{ padding: '12px 20px 110px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div className="field-label">NAME</div>
          <input
            type="text"
            value={newFood.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Cottage Cheese"
            className="text-input text-input--form"
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label">SERVING SIZE</div>
            <input type="number" value={newFood.servingSize} onChange={(e) => onChange('servingSize', e.target.value)} className="text-input text-input--form" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label">UNIT</div>
            <input type="text" value={newFood.servingUnit} onChange={(e) => onChange('servingUnit', e.target.value)} placeholder="g, unit, tbsp…" className="text-input text-input--form" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: 'var(--protein)' }}>PROTEIN (G)</div>
            <input type="number" inputMode="decimal" value={newFood.protein} onChange={(e) => onChange('protein', e.target.value)} className="text-input text-input--form" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: 'var(--carbs)' }}>CARBS (G)</div>
            <input type="number" inputMode="decimal" value={newFood.carbs} onChange={(e) => onChange('carbs', e.target.value)} className="text-input text-input--form" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label" style={{ color: 'var(--fat)' }}>FAT (G)</div>
            <input type="number" inputMode="decimal" value={newFood.fat} onChange={(e) => onChange('fat', e.target.value)} className="text-input text-input--form" />
          </div>
        </div>
        <div>
          <div className="field-label" style={{ color: 'var(--accent)' }}>CALORIES (AUTO)</div>
          <div
            className="text-input text-input--form"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text)', background: 'rgba(255,255,255,0.03)' }}
          >
            <span style={{ font: "700 16px 'Space Grotesk'", color: 'var(--accent)' }}>{calories}</span>
            <span style={{ font: '500 12px Manrope', color: 'var(--text-45)' }}>= P×4 + C×4 + F×9 kcal</span>
          </div>
        </div>
        <button
          onClick={onSave}
          disabled={invalid}
          className="btn-primary"
          style={{ marginTop: 6, background: invalid ? 'var(--accent-dim)' : 'var(--accent)' }}
        >{editing ? 'Save Changes' : 'Save Food'}</button>
      </div>
    </div>
  );
}
