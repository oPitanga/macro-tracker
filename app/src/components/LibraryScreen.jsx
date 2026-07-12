export default function LibraryScreen({ foods, libQuery, onLibQueryChange, onDeleteFood, onEditFood, onAddFood }) {
  const q = libQuery.trim().toLowerCase();
  const filtered = foods
    .filter((f) => f.name.toLowerCase().includes(q))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

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
              onClick={() => onEditFood(f)}
              aria-label={`Edit ${f.name}`}
              style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.07)', color: 'var(--text-60)', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14.5 5.5l4 4L8 20l-4 1 1-4L14.5 5.5z" stroke="var(--text-60)" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => onDeleteFood(f.id)}
              aria-label={`Delete ${f.name}`}
              style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.07)', color: 'var(--text-60)', font: '600 15px Manrope', cursor: 'pointer', flexShrink: 0 }}
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
