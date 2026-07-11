import { DAYS } from './seed';

export function round1(n) {
  return Math.round(n * 10) / 10;
}

/** Maps a date string to its weekday key ('mon'..'sun'), Monday-first. */
export function dayOfWeekKey(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return DAYS[(d.getDay() + 6) % 7];
}

export function todayDateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fullDateLabel(d = new Date()) {
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

export function shortDayLabel(dateStr, todayStr) {
  if (dateStr === todayStr) return 'Today';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export function pct(value, goal) {
  return goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;
}

/** Estimates calories from macros using the 4/4/9 kcal-per-gram (Atwater) factors. */
export function caloriesFromMacros(protein, carbs, fat) {
  const p = parseFloat(protein) || 0;
  const c = parseFloat(carbs) || 0;
  const f = parseFloat(fat) || 0;
  return Math.round(p * 4 + c * 4 + f * 9);
}

export function entryMacros(entry, foods) {
  const food = foods.find(f => f.id === entry.foodId);
  if (!food) return { name: '?', cal: 0, protein: 0, carbs: 0, fat: 0, qtyLabel: '' };
  const mult = entry.qty / food.servingSize;
  return {
    name: food.name,
    cal: Math.round(food.calories * mult),
    protein: round1(food.protein * mult),
    carbs: round1(food.carbs * mult),
    fat: round1(food.fat * mult),
    qtyLabel: `${entry.qty}${food.servingUnit}`,
  };
}

/** Sums macros for every food planned on a given weekday + meal. */
export function planMealMacros(day, meal, mealPlan, foods) {
  const entries = mealPlan[day]?.[meal] || [];
  let cal = 0, protein = 0, carbs = 0, fat = 0;
  entries.forEach((e) => {
    const m = entryMacros(e, foods);
    cal += m.cal; protein += m.protein; carbs += m.carbs; fat += m.fat;
  });
  return { cal: Math.round(cal), protein: round1(protein), carbs: round1(carbs), fat: round1(fat) };
}

export function lastNDates(n, todayStr) {
  const out = [];
  const base = new Date(todayStr + 'T00:00:00');
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    out.push(todayDateStr(d));
  }
  return out;
}

/** Sums macros for every log entry on a given date. */
export function daySummary(dateStr, log, foods) {
  const entries = log.filter(e => e.date === dateStr);
  let calories = 0, protein = 0, carbs = 0, fat = 0;
  entries.forEach(e => {
    const m = entryMacros(e, foods);
    calories += m.cal; protein += m.protein; carbs += m.carbs; fat += m.fat;
  });
  return {
    date: dateStr,
    calories: Math.round(calories),
    protein: round1(protein),
    carbs: round1(carbs),
    fat: round1(fat),
  };
}
