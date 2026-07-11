export default function GoalsScreen({ goals, goalsDraft, onDraftChange, onSave, onRequestDeleteHistory, hasHistoryDisabled }) {
  const changed = JSON.stringify(goals) !== JSON.stringify(goalsDraft);

  return (
    <div className="screen">
      <div className="page-head page-head--tight">
        <div className="page-title">Daily Goals</div>
        <div className="page-subtitle">Used to track your progress each day</div>
      </div>
      <div className="screen-scroll" style={{ padding: '12px 20px 110px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div className="field-label" style={{ color: 'var(--accent)' }}>CALORIES (KCAL)</div>
          <input type="number" value={goalsDraft.calories} onChange={(e) => onDraftChange('calories', e.target.value)} className="text-input text-input--goal" />
        </div>
        <div>
          <div className="field-label" style={{ color: 'var(--protein)' }}>PROTEIN (G)</div>
          <input type="number" value={goalsDraft.protein} onChange={(e) => onDraftChange('protein', e.target.value)} className="text-input text-input--goal" />
        </div>
        <div>
          <div className="field-label" style={{ color: 'var(--carbs)' }}>CARBS (G)</div>
          <input type="number" value={goalsDraft.carbs} onChange={(e) => onDraftChange('carbs', e.target.value)} className="text-input text-input--goal" />
        </div>
        <div>
          <div className="field-label" style={{ color: 'var(--fat)' }}>FAT (G)</div>
          <input type="number" value={goalsDraft.fat} onChange={(e) => onDraftChange('fat', e.target.value)} className="text-input text-input--goal" />
        </div>
        <button
          onClick={onSave}
          className="btn-primary"
          style={{ marginTop: 6, background: changed ? 'var(--accent)' : 'var(--accent-dim)' }}
        >{changed ? 'Save Goals' : 'Saved'}</button>

        <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border-input)' }}>
          <div className="field-label" style={{ marginBottom: 8 }}>DANGER ZONE</div>
          <button onClick={onRequestDeleteHistory} disabled={hasHistoryDisabled} className="btn-danger">Delete History</button>
        </div>
      </div>
    </div>
  );
}
