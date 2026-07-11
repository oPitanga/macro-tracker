export default function BottomNav({ screen, goHome, goLibrary, goHistory, goGoals, goMealPlan }) {
  const color = (active) => (active ? 'var(--accent)' : 'var(--text-40)');
  const homeColor = color(screen === 'home');
  const libraryColor = color(screen === 'library' || screen === 'addFood');
  const planColor = color(screen === 'mealPlan');
  const historyColor = color(screen === 'history');
  const goalsColor = color(screen === 'goals');

  return (
    <div className="bottom-nav-float">
      <div className="bottom-nav">
        <button className="nav-btn" onClick={goHome}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 11L12 4l8 7v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-8z" stroke={homeColor} strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <span style={{ color: homeColor }}>Today</span>
        </button>
        <button className="nav-btn" onClick={goLibrary}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="4" rx="1" stroke={libraryColor} strokeWidth="2" />
            <rect x="4" y="10" width="16" height="4" rx="1" stroke={libraryColor} strokeWidth="2" />
            <rect x="4" y="16" width="16" height="4" rx="1" stroke={libraryColor} strokeWidth="2" />
          </svg>
          <span style={{ color: libraryColor }}>Library</span>
        </button>
        <button className="nav-btn" onClick={goMealPlan}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="5" width="16" height="15" rx="2" stroke={planColor} strokeWidth="2" />
            <path d="M4 9.5h16M8 3v3.5M16 3v3.5" stroke={planColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ color: planColor }}>Plan</span>
        </button>
        <button className="nav-btn" onClick={goHistory}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 19V10M12 19V5M19 19v-7" stroke={historyColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ color: historyColor }}>History</span>
        </button>
        <button className="nav-btn" onClick={goGoals}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke={goalsColor} strokeWidth="2" />
            <circle cx="12" cy="12" r="3" stroke={goalsColor} strokeWidth="2" />
          </svg>
          <span style={{ color: goalsColor }}>Goals</span>
        </button>
      </div>
    </div>
  );
}
