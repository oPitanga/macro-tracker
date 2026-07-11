export default function LibraryScreen({ foods, libQuery, onLibQueryChange, onDeleteFood, onAddFood }) {
  const q = libQuery.trim().toLowerCase();
  const filtered = foods.filter((f) => f.name.toLowerCase().includes(q));

  return (
    <div className="screen">
      <div className="page-head page-head--tight" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="page-title">Food Library</div>
        <button className="icon-btn--square" style={{ background: 'var(--accent)', color: '#121316' }} onClick={onAddFood}>+</button>
      </div>
      <div style={{ padding: '0 20px 12px', flexShrink: 0 }}>
        <input type="text" value={libQuery} onChange={(e) => onLibQueryChange(e.target.value)} placeholder="Search foods…" className="text-input" />
      </div>
      <div className="screen-scroll" style={{ padding: '0 20px 110px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((f) => (
          <div key={f.id} className="card-16" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '600 14px Manrope' }}>{f.name}</div>
              <div style={{ font: '500 12px Manrope', color: 'var(--text-45)', marginTop: 3 }}>
                Per {f.servingSize}{f.servingUnit}: {f.calories} kcal · P{f.protein}g C{f.carbs}g F{f.fat}g
              </div>
            </div>
            <button
              onClick={() => onDeleteFood(f.id)}
              style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.07)', color: 'var(--text-60)', font: '600 15px Manrope', cursor: 'pointer', flexShrink: 0 }}
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
