
import { LoveData } from '../types';

const STORAGE_KEY = 'valentine_pro_db';

export const saveLoveData = (data: LoveData) => {
  const existing = getStore();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, [data.slug]: data }));
};

export const getLoveData = (slug: string): LoveData | null => {
  const store = getStore();
  return store[slug] || null;
};

const getStore = (): Record<string, LoveData> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

// For "Production-Ready" feel, we persist to the browser.
