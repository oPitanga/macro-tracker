export default function BarChartCard({ title, titleColor, days, height, legend }) {
  return (
    <div className="card" style={{ padding: legend ? '18px 16px 14px' : '16px 16px 12px' }}>
      {title && (
        <div style={{ font: '700 12px Manrope', color: titleColor, letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height, gap: 8 }}>
        {days.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: 6 }}>
            <div style={{ font: "600 10px 'Space Grotesk'", color: 'var(--text-50)' }}>{d.valueLabel}</div>
            <div style={{ width: '100%', maxWidth: 22, height: d.barHeight, borderRadius: 6, background: d.barColor }} />
            <div style={{ font: '600 11px Manrope', color: 'var(--text-55)' }}>{d.dayLabel}</div>
          </div>
        ))}
      </div>
      {legend && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)' }} />
          <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>within ±10% of goal</div>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--protein)', marginLeft: 10 }} />
          <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>off target</div>
        </div>
      )}
    </div>
  );
}
