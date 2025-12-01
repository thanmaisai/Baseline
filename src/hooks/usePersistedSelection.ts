import { useState, useEffect } from 'react';
import { Selection } from '@/types/tools';

const STORAGE_KEY = 'baseline-selection';

const defaultSelection: Selection = {
  tools: [],
  languageVersions: [],
  customScripts: [],
};

export const usePersistedSelection = () => {
  const [selection, setSelection] = useState<Selection>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load saved selection:', error);
    }
    return defaultSelection;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch (error) {
      console.error('Failed to save selection:', error);
    }
  }, [selection]);

  const clearSelection = () => {
    setSelection(defaultSelection);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { selection, setSelection, clearSelection };
};
