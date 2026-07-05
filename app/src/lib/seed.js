export const DEFAULT_GOALS = { calories: 2200, protein: 150, carbs: 220, fat: 70 };

export const MEAL_TYPES = ['breakfast', 'lunch', 'snacks', 'dinner'];

export const MEAL_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snacks: 'Snacks',
  dinner: 'Dinner',
};

export const DEFAULT_FOODS = [
  { id: 1, name: 'Chicken Breast', servingSize: 100, servingUnit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 2, name: 'Brown Rice', servingSize: 100, servingUnit: 'g', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9 },
  { id: 3, name: 'Egg', servingSize: 1, servingUnit: 'unit', calories: 70, protein: 6, carbs: 0.6, fat: 5 },
  { id: 4, name: 'Greek Yogurt', servingSize: 100, servingUnit: 'g', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { id: 5, name: 'Banana', servingSize: 1, servingUnit: 'unit', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: 6, name: 'Almonds', servingSize: 30, servingUnit: 'g', calories: 174, protein: 6.4, carbs: 6, fat: 15 },
  { id: 7, name: 'Oats', servingSize: 100, servingUnit: 'g', calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  { id: 8, name: 'Salmon', servingSize: 100, servingUnit: 'g', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 9, name: 'Broccoli', servingSize: 100, servingUnit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { id: 10, name: 'Olive Oil', servingSize: 1, servingUnit: 'tbsp', calories: 119, protein: 0, carbs: 0, fat: 13.5 },
];

export function initialState() {
  return {
    goals: { ...DEFAULT_GOALS },
    foods: DEFAULT_FOODS.map(f => ({ ...f })),
    nextFoodId: DEFAULT_FOODS.length + 1,
    nextLogId: 1,
    log: [],
    starredByMeal: { breakfast: [], lunch: [], dinner: [], snacks: [] },
  };
}
