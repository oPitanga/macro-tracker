import { useEffect, useState } from 'react';
import './App.css';
import { loadState, saveState } from './lib/storage';
import { initialState } from './lib/seed';
import { todayDateStr, fullDateLabel, dayOfWeekKey } from './lib/calc';
import TodayScreen from './components/TodayScreen';
import LogFoodScreen from './components/LogFoodScreen';
import LibraryScreen from './components/LibraryScreen';
import AddFoodScreen from './components/AddFoodScreen';
import GoalsScreen from './components/GoalsScreen';
import HistoryScreen from './components/HistoryScreen';
import MealPlanScreen from './components/MealPlanScreen';
import BottomNav from './components/BottomNav';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const EMPTY_NEW_FOOD = { name: '', servingSize: 100, servingUnit: 'g', calories: '', protein: '', carbs: '', fat: '' };

function App() {
  const [data, setData] = useState(() => ({ ...initialState(), ...(loadState() ?? {}) }));
  useEffect(() => { saveState(data); }, [data]);

  const todayStr = todayDateStr();
  const todayLabel = fullDateLabel();
  const todayDayKey = dayOfWeekKey(todayStr);

  const [screen, setScreen] = useState('home');
  const [logQuery, setLogQuery] = useState('');
  const [logMeal, setLogMeal] = useState('breakfast');
  const [expandedFoodId, setExpandedFoodId] = useState(null);
  const [qtyDrafts, setQtyDrafts] = useState({});
  const [libQuery, setLibQuery] = useState('');
  const [newFood, setNewFood] = useState(EMPTY_NEW_FOOD);
  const [goalsDraft, setGoalsDraft] = useState(data.goals);
  const [confirmDeleteHistory, setConfirmDeleteHistory] = useState(false);

  const [planDay, setPlanDay] = useState(todayDayKey);
  const [planMeal, setPlanMeal] = useState('breakfast');
  const [planQuery, setPlanQuery] = useState('');
  const [planExpandedFoodId, setPlanExpandedFoodId] = useState(null);
  const [planQtyDrafts, setPlanQtyDrafts] = useState({});

  function goHome() { setScreen('home'); }
  function goLogFood() { setExpandedFoodId(null); setLogQuery(''); setScreen('logFood'); }
  function goLibrary() { setLibQuery(''); setScreen('library'); }
  function goHistory() { setScreen('history'); }
  function goGoals() { setGoalsDraft({ ...data.goals }); setScreen('goals'); }
  function goAddFood() { setScreen('addFood'); }
  function goMealPlan(day, meal) {
    setPlanDay(day ?? todayDayKey);
    setPlanMeal(meal ?? 'breakfast');
    setPlanQuery('');
    setPlanExpandedFoodId(null);
    setScreen('mealPlan');
  }

  function toggleStar(meal, foodId) {
    setData((s) => {
      const cur = s.starredByMeal[meal] || [];
      const next = cur.includes(foodId) ? cur.filter((id) => id !== foodId) : [...cur, foodId];
      return { ...s, starredByMeal: { ...s.starredByMeal, [meal]: next } };
    });
  }

  function toggleExpand(foodId) {
    setExpandedFoodId((prev) => (prev === foodId ? null : foodId));
    setQtyDrafts((prev) => (
      prev[foodId] !== undefined ? prev : { ...prev, [foodId]: String(data.foods.find((f) => f.id === foodId).servingSize) }
    ));
  }

  function setQtyDraft(foodId, val) {
    setQtyDrafts((prev) => ({ ...prev, [foodId]: val }));
  }

  function confirmAddLog(foodId) {
    const qty = parseFloat(qtyDrafts[foodId]);
    if (!qty || qty <= 0) return;
    setData((s) => ({
      ...s,
      log: [...s.log, { id: s.nextLogId, date: todayStr, meal: logMeal, foodId, qty }],
      nextLogId: s.nextLogId + 1,
    }));
    setExpandedFoodId(null);
  }

  function removeLogEntry(id) {
    setData((s) => ({ ...s, log: s.log.filter((e) => e.id !== id) }));
  }

  function togglePlanExpand(foodId) {
    setPlanExpandedFoodId((prev) => (prev === foodId ? null : foodId));
    setPlanQtyDrafts((prev) => (
      prev[foodId] !== undefined ? prev : { ...prev, [foodId]: String(data.foods.find((f) => f.id === foodId).servingSize) }
    ));
  }

  function setPlanQtyDraft(foodId, val) {
    setPlanQtyDrafts((prev) => ({ ...prev, [foodId]: val }));
  }

  function confirmAddPlan(foodId) {
    const qty = parseFloat(planQtyDrafts[foodId]);
    if (!qty || qty <= 0) return;
    setData((s) => {
      const dayPlan = s.mealPlan[planDay];
      const mealEntries = [...dayPlan[planMeal], { id: s.nextPlanId, foodId, qty }];
      return {
        ...s,
        mealPlan: { ...s.mealPlan, [planDay]: { ...dayPlan, [planMeal]: mealEntries } },
        nextPlanId: s.nextPlanId + 1,
      };
    });
    setPlanExpandedFoodId(null);
  }

  function removePlanEntry(id) {
    setData((s) => {
      const dayPlan = s.mealPlan[planDay];
      return {
        ...s,
        mealPlan: { ...s.mealPlan, [planDay]: { ...dayPlan, [planMeal]: dayPlan[planMeal].filter((e) => e.id !== id) } },
      };
    });
  }

  function updateNewFood(key, value) {
    setNewFood((prev) => ({ ...prev, [key]: value }));
  }

  function saveNewFood() {
    if (!newFood.name.trim()) return;
    setData((s) => ({
      ...s,
      foods: [...s.foods, {
        id: s.nextFoodId,
        name: newFood.name.trim(),
        servingSize: parseFloat(newFood.servingSize) || 100,
        servingUnit: newFood.servingUnit.trim() || 'g',
        calories: parseFloat(newFood.calories) || 0,
        protein: parseFloat(newFood.protein) || 0,
        carbs: parseFloat(newFood.carbs) || 0,
        fat: parseFloat(newFood.fat) || 0,
      }],
      nextFoodId: s.nextFoodId + 1,
    }));
    setNewFood(EMPTY_NEW_FOOD);
    setScreen('library');
  }

  function deleteFood(id) {
    setData((s) => ({ ...s, foods: s.foods.filter((f) => f.id !== id) }));
  }

  function updateGoalsDraft(key, value) {
    setGoalsDraft((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  }

  function saveGoals() {
    setData((s) => ({ ...s, goals: { ...goalsDraft } }));
  }

  function requestDeleteHistory() { setConfirmDeleteHistory(true); }
  function cancelDeleteHistory() { setConfirmDeleteHistory(false); }
  function deleteHistoryConfirmed() {
    setData((s) => ({ ...s, log: s.log.filter((e) => e.date === todayStr) }));
    setConfirmDeleteHistory(false);
  }

  const hasPastHistory = data.log.some((e) => e.date !== todayStr);

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <TodayScreen
          todayLabel={todayLabel}
          goals={data.goals}
          log={data.log}
          foods={data.foods}
          todayStr={todayStr}
          mealPlan={data.mealPlan}
          todayDayKey={todayDayKey}
          onRemoveEntry={removeLogEntry}
          onLogFood={goLogFood}
          onEditPlan={goMealPlan}
        />
      )}
      {screen === 'logFood' && (
        <LogFoodScreen
          foods={data.foods}
          logMeal={logMeal}
          onSelectMeal={setLogMeal}
          logQuery={logQuery}
          onLogQueryChange={setLogQuery}
          starredByMeal={data.starredByMeal}
          onToggleStar={toggleStar}
          expandedFoodId={expandedFoodId}
          onToggleExpand={toggleExpand}
          qtyDrafts={qtyDrafts}
          onQtyChange={setQtyDraft}
          onAdd={confirmAddLog}
          onBack={goHome}
        />
      )}
      {screen === 'library' && (
        <LibraryScreen
          foods={data.foods}
          libQuery={libQuery}
          onLibQueryChange={setLibQuery}
          onDeleteFood={deleteFood}
          onAddFood={goAddFood}
        />
      )}
      {screen === 'addFood' && (
        <AddFoodScreen
          newFood={newFood}
          onChange={updateNewFood}
          onSave={saveNewFood}
          onBack={goLibrary}
        />
      )}
      {screen === 'goals' && (
        <GoalsScreen
          goals={data.goals}
          goalsDraft={goalsDraft}
          onDraftChange={updateGoalsDraft}
          onSave={saveGoals}
          onRequestDeleteHistory={requestDeleteHistory}
          hasHistoryDisabled={!hasPastHistory}
        />
      )}
      {screen === 'history' && (
        <HistoryScreen
          log={data.log}
          foods={data.foods}
          goals={data.goals}
          todayStr={todayStr}
        />
      )}
      {screen === 'mealPlan' && (
        <MealPlanScreen
          foods={data.foods}
          mealPlan={data.mealPlan}
          todayDayKey={todayDayKey}
          planDay={planDay}
          onSelectDay={setPlanDay}
          planMeal={planMeal}
          onSelectMeal={setPlanMeal}
          planQuery={planQuery}
          onPlanQueryChange={setPlanQuery}
          expandedFoodId={planExpandedFoodId}
          onToggleExpand={togglePlanExpand}
          qtyDrafts={planQtyDrafts}
          onQtyChange={setPlanQtyDraft}
          onAdd={confirmAddPlan}
          onRemoveEntry={removePlanEntry}
        />
      )}

      <BottomNav screen={screen} goHome={goHome} goLibrary={goLibrary} goHistory={goHistory} goGoals={goGoals} goMealPlan={() => goMealPlan()} />

      {confirmDeleteHistory && (
        <DeleteConfirmModal onCancel={cancelDeleteHistory} onConfirm={deleteHistoryConfirmed} />
      )}
    </div>
  );
}

export default App;
