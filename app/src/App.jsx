import { useEffect, useState } from 'react';
import './App.css';
import { loadState, saveState } from './lib/storage';
import { initialState, DAYS, emptyMealPlan } from './lib/seed';
import { todayDateStr, fullDateLabel, dayOfWeekKey, caloriesFromMacros } from './lib/calc';
import TodayScreen from './components/TodayScreen';
import LogFoodScreen from './components/LogFoodScreen';
import LibraryScreen from './components/LibraryScreen';
import AddFoodScreen from './components/AddFoodScreen';
import GoalsScreen from './components/GoalsScreen';
import HistoryScreen from './components/HistoryScreen';
import MealPlanScreen from './components/MealPlanScreen';
import BottomNav from './components/BottomNav';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const EMPTY_NEW_FOOD = { name: '', servingSize: 100, servingUnit: 'g', protein: '', carbs: '', fat: '' };

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
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [goalsDraft, setGoalsDraft] = useState(data.goals);
  const [confirmDeleteHistory, setConfirmDeleteHistory] = useState(false);

  const [planDay, setPlanDay] = useState(todayDayKey);
  const [planMeal, setPlanMeal] = useState('breakfast');
  const [planQuery, setPlanQuery] = useState('');
  const [planExpandedFoodId, setPlanExpandedFoodId] = useState(null);
  const [planQtyDrafts, setPlanQtyDrafts] = useState({});
  const [planAddDays, setPlanAddDays] = useState([todayDayKey]);
  const [mealPlanDraft, setMealPlanDraft] = useState(data.mealPlan);
  const [planDraftNextId, setPlanDraftNextId] = useState(data.nextPlanId);
  const [confirmClearPlan, setConfirmClearPlan] = useState(false);

  function goHome() { setScreen('home'); }
  function goLogFood() { setExpandedFoodId(null); setLogQuery(''); setScreen('logFood'); }
  function goLibrary() { setLibQuery(''); setScreen('library'); }
  function goHistory() { setScreen('history'); }
  function goGoals() { setGoalsDraft({ ...data.goals }); setScreen('goals'); }
  function goAddFood() { setEditingFoodId(null); setNewFood(EMPTY_NEW_FOOD); setScreen('addFood'); }
  function goEditFood(food) {
    setEditingFoodId(food.id);
    setNewFood({
      name: food.name,
      servingSize: String(food.servingSize),
      servingUnit: food.servingUnit,
      protein: String(food.protein),
      carbs: String(food.carbs),
      fat: String(food.fat),
    });
    setScreen('addFood');
  }
  function backFromFood() { setEditingFoodId(null); setNewFood(EMPTY_NEW_FOOD); goLibrary(); }
  function goMealPlan(day, meal) {
    const resolvedDay = day ?? todayDayKey;
    setPlanDay(resolvedDay);
    setPlanMeal(meal ?? 'breakfast');
    setPlanQuery('');
    setPlanExpandedFoodId(null);
    setPlanAddDays([resolvedDay]);
    setMealPlanDraft(data.mealPlan);
    setPlanDraftNextId(data.nextPlanId);
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

  function logBody({ date, weight, bodyFat }) {
    setData((s) => {
      const existing = s.bodyLog.find((e) => e.date === date);
      const merged = {
        date,
        weight: weight != null ? weight : (existing?.weight ?? null),
        bodyFat: bodyFat != null ? bodyFat : (existing?.bodyFat ?? null),
      };
      if (merged.weight == null && merged.bodyFat == null) return s;
      const rest = s.bodyLog.filter((e) => e.date !== date);
      const bodyLog = [...rest, merged].sort((a, b) => a.date.localeCompare(b.date));
      return { ...s, bodyLog };
    });
  }

  function removeBody(date) {
    setData((s) => ({ ...s, bodyLog: s.bodyLog.filter((e) => e.date !== date) }));
  }

  function selectPlanDay(day) {
    setPlanDay(day);
    setPlanAddDays([day]);
  }

  function togglePlanAddDay(day) {
    setPlanAddDays((prev) => {
      if (prev.includes(day)) return prev.length > 1 ? prev.filter((d) => d !== day) : prev;
      return [...prev, day];
    });
  }

  function toggleAllPlanAddDays() {
    setPlanAddDays((prev) => (prev.length === DAYS.length ? [planDay] : [...DAYS]));
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
    let nextId = planDraftNextId;
    setMealPlanDraft((prev) => {
      const mealPlan = { ...prev };
      planAddDays.forEach((day) => {
        const dayPlan = mealPlan[day];
        mealPlan[day] = { ...dayPlan, [planMeal]: [...dayPlan[planMeal], { id: nextId, foodId, qty }] };
        nextId += 1;
      });
      return mealPlan;
    });
    setPlanDraftNextId(nextId);
    setPlanExpandedFoodId(null);
  }

  function removePlanEntry(id) {
    setMealPlanDraft((prev) => {
      const dayPlan = prev[planDay];
      return { ...prev, [planDay]: { ...dayPlan, [planMeal]: dayPlan[planMeal].filter((e) => e.id !== id) } };
    });
  }

  function savePlan() {
    setData((s) => ({ ...s, mealPlan: mealPlanDraft, nextPlanId: planDraftNextId }));
  }

  function requestClearPlan() { setConfirmClearPlan(true); }
  function cancelClearPlan() { setConfirmClearPlan(false); }
  function clearPlanConfirmed() {
    setMealPlanDraft(emptyMealPlan());
    setConfirmClearPlan(false);
  }

  function updateNewFood(key, value) {
    setNewFood((prev) => ({ ...prev, [key]: value }));
  }

  function saveNewFood() {
    if (!newFood.name.trim()) return;
    const protein = parseFloat(newFood.protein) || 0;
    const carbs = parseFloat(newFood.carbs) || 0;
    const fat = parseFloat(newFood.fat) || 0;
    const fields = {
      name: newFood.name.trim(),
      servingSize: parseFloat(newFood.servingSize) || 100,
      servingUnit: newFood.servingUnit.trim() || 'g',
      calories: caloriesFromMacros(protein, carbs, fat),
      protein,
      carbs,
      fat,
    };
    if (editingFoodId != null) {
      setData((s) => ({
        ...s,
        foods: s.foods.map((f) => (f.id === editingFoodId ? { ...f, ...fields } : f)),
      }));
    } else {
      setData((s) => ({
        ...s,
        foods: [...s.foods, { id: s.nextFoodId, ...fields }],
        nextFoodId: s.nextFoodId + 1,
      }));
    }
    setNewFood(EMPTY_NEW_FOOD);
    setEditingFoodId(null);
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
  const planChanged = JSON.stringify(data.mealPlan) !== JSON.stringify(mealPlanDraft);

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
          onEditFood={goEditFood}
          onAddFood={goAddFood}
        />
      )}
      {screen === 'addFood' && (
        <AddFoodScreen
          newFood={newFood}
          editing={editingFoodId != null}
          onChange={updateNewFood}
          onSave={saveNewFood}
          onBack={backFromFood}
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
          bodyLog={data.bodyLog}
          onLogBody={logBody}
          onRemoveBody={removeBody}
        />
      )}
      {screen === 'mealPlan' && (
        <MealPlanScreen
          foods={data.foods}
          mealPlan={mealPlanDraft}
          todayDayKey={todayDayKey}
          planDay={planDay}
          onSelectDay={selectPlanDay}
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
          planAddDays={planAddDays}
          onTogglePlanAddDay={togglePlanAddDay}
          onToggleAllPlanAddDays={toggleAllPlanAddDays}
          planChanged={planChanged}
          onSavePlan={savePlan}
          onRequestClearPlan={requestClearPlan}
        />
      )}

      <BottomNav screen={screen} goHome={goHome} goLibrary={goLibrary} goHistory={goHistory} goGoals={goGoals} goMealPlan={() => goMealPlan()} />

      {confirmDeleteHistory && (
        <DeleteConfirmModal onCancel={cancelDeleteHistory} onConfirm={deleteHistoryConfirmed} />
      )}
      {confirmClearPlan && (
        <DeleteConfirmModal
          onCancel={cancelClearPlan}
          onConfirm={clearPlanConfirmed}
          title="Clear all meal plans?"
          body="This clears every planned meal for every day of the week. Save is still required to make it permanent."
          confirmLabel="Clear all"
        />
      )}
    </div>
  );
}

export default App;
