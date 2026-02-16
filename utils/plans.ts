export type FastingPlan = {
  label: string;
  hours: number;
  seconds: number;
};

export const FASTING_PLANS: FastingPlan[] = [
  { label: '12:12', hours: 12, seconds: 12 * 60 * 60 },
  { label: '14:10', hours: 14, seconds: 14 * 60 * 60 },
  { label: '16:8', hours: 16, seconds: 16 * 60 * 60 },
  { label: '18:6', hours: 18, seconds: 18 * 60 * 60 },
  { label: '20:4', hours: 20, seconds: 20 * 60 * 60 },
];
