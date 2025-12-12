export interface Habit {
    id: string;
    name: string;
    type: 'MEASURABLE' | 'BOOLEAN';
    unit?: string | null;
    userId: string;
    createdAt: Date;
}

export interface HabitLog {
    id: string;
    habitId: string;
    date: string; // YYYY-MM-DD
    numericValue?: number | null;
    booleanValue?: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateHabitInput {
    name: string;
    type: 'MEASURABLE' | 'BOOLEAN';
    unit?: string;
}

export interface CreateLogInput {
    habitId: string;
    date: string; // YYYY-MM-DD
    numericValue?: number;
    booleanValue?: boolean;
}

export interface UpdateLogInput {
    numericValue?: number;
    booleanValue?: boolean;
}

export interface PresetHabit {
    name: string;
    type: 'MEASURABLE' | 'BOOLEAN';
    unit?: string;
    category: string;
}

export const PRESET_HABITS: PresetHabit[] = [
    // Health & Fitness
    { name: 'Morning Run', type: 'MEASURABLE', unit: 'km', category: 'Fitness' },
    { name: 'Workout Session', type: 'MEASURABLE', unit: 'minutes', category: 'Fitness' },
    { name: 'Yoga/Stretching', type: 'MEASURABLE', unit: 'minutes', category: 'Fitness' },
    { name: 'Drink Water', type: 'MEASURABLE', unit: 'glasses', category: 'Health' },
    { name: 'Take Vitamins', type: 'BOOLEAN', category: 'Health' },

    // Nutrition
    { name: 'No Sugar', type: 'BOOLEAN', category: 'Nutrition' },
    { name: 'No Nicotine', type: 'BOOLEAN', category: 'Nutrition' },
    { name: 'No Alcohol', type: 'BOOLEAN', category: 'Nutrition' },
    { name: 'Eat Vegetables', type: 'MEASURABLE', unit: 'servings', category: 'Nutrition' },

    // Productivity
    { name: 'Reading', type: 'MEASURABLE', unit: 'minutes', category: 'Learning' },
    { name: 'Study/Learn', type: 'MEASURABLE', unit: 'minutes', category: 'Learning' },
    { name: 'Meditation', type: 'MEASURABLE', unit: 'minutes', category: 'Mindfulness' },
    { name: 'Journal', type: 'BOOLEAN', category: 'Mindfulness' },
    { name: 'Practice Gratitude', type: 'BOOLEAN', category: 'Mindfulness' },

    // Sleep
    { name: 'Sleep 8 Hours', type: 'BOOLEAN', category: 'Sleep' },
    { name: 'No Screen Before Bed', type: 'BOOLEAN', category: 'Sleep' },
];
