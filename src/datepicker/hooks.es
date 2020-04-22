import { useMemo } from 'react';
import { mergeThemes, getSubTheme } from './utils';

export const useComposedTheme = (themeA, themeB) => (
  useMemo(() => (
    mergeThemes(themeA, themeB)
  ), [themeA, themeB])
);

export const useSubTheme = (theme, prefix) => (
  useMemo(() => (
    getSubTheme(theme, prefix)
  ), [theme, prefix])
);
