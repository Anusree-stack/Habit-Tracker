export interface UIHabit {
    id: string;
    name: string;
    description?: string;
    measurable: boolean;
    unit?: string;
    target?: number;
    todayValue: number | boolean;
    icon: string;
    color: string;
    frequency: string;
    daysPerWeek: number;
    completions: Record<string, number | boolean>;
}
