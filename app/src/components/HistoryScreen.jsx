import { lastNDates, daySummary, shortDayLabel } from '../lib/calc';
import BarChartCard from './BarChartCard';

const MUTED = 'rgba(245,246,247,0.25)';

function isWithinGoal(value, goal) {
  return goal > 0 ? Math.abs(value - goal) / goal <= 0.1 : true;
}

export default function HistoryScreen({ log, foods, goals, todayStr }) {
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

  const historyRows = [...days].reverse().map((d) => {
    const delta = d.calories - goals.calories;
    return {
      date: d.date,
      dateLabel: shortDayLabel(d.date, todayStr),
      deltaLabel: (delta >= 0 ? '+' : '') + delta + ' kcal',
      deltaColor: isWithinGoal(d.calories, goals.calories) ? 'var(--accent)' : 'var(--protein)',
      protein: d.protein, carbs: d.carbs, fat: d.fat,
    };
  });

  return (
    <div className="screen">
      <div className="page-head">
        <div className="page-title">History</div>
        <div className="page-subtitle">Last 7 days vs your goal</div>
      </div>
      <div className="screen-scroll" style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BarChartCard days={calorieDays} height={140} legend />
        <BarChartCard title="Protein" titleColor="var(--protein)" days={proteinDays} height={100} />
        <BarChartCard title="Carbs" titleColor="var(--carbs)" days={carbsDays} height={100} />
        <BarChartCard title="Fat" titleColor="var(--fat)" days={fatDays} height={100} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {historyRows.map((r) => (
            <div key={r.date} className="card-16">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ font: "700 14px 'Space Grotesk'" }}>{r.dateLabel}</div>
                <div style={{ font: "600 13px 'Space Grotesk'", color: r.deltaColor }}>{r.deltaLabel}</div>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>P <span style={{ color: 'var(--protein)', fontWeight: 700 }}>{r.protein}g</span></div>
                <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>C <span style={{ color: 'var(--carbs)', fontWeight: 700 }}>{r.carbs}g</span></div>
                <div style={{ font: '500 12px Manrope', color: 'var(--text-50)' }}>F <span style={{ color: 'var(--fat)', fontWeight: 700 }}>{r.fat}g</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
