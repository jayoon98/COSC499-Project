import React from 'react';

export type Theme = {
  name: string; // Readable name for the theme
  physical: string;
  social: string;
  emotional: string;
  mental: string;
  spiritual: string;
};

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// NOTE: If we were to have light and dark themes, this should be a separate
// object in the context since it would be updated separatly.
// ie the context could look like { theme, setTheme, baseTheme, setBaseTheme }
export const baseThemes = {
  light: {
    background: '#fff',
    foreground: '#000', //used for text
  },
  dark: {
    background: '#121212',
    foreground: '#faf9f7',
  },
};

export const themes: { [themeName: string]: Theme } = {
  theme1: {
    name: 'Theme 1',
    physical: '#5350ef',
    social: '#fa7f72',
    emotional: '#389393',
    mental: '#f5a25d',
    spiritual: '#a8dda8',
  },
  theme2: {
    name: 'Theme 2',
    physical: '#7785ac',
    social: '#9cb380',
    emotional: '#522a27',
    mental: '#c73e1d',
    spiritual: '#c59849',
  },
  theme3: {
    name: 'Theme 3',
    physical: '#031d44',
    social: '#04395e',
    emotional: '#70a288',
    mental: '#dab785',
    spiritual: '#d5896f',
  },
  theme4: {
    name: 'Theme 4',
    physical: '#ff99c8',
    social: '#f5efa6',
    emotional: '#BDEFD0',
    mental: '#a9def9',
    spiritual: '#e4c1f9',
  },
  theme5: {
    name: 'Theme 5',
    physical: '#303f9f',
    social: '#00897b',
    emotional: '#ffa000',
    mental: '#c6282b',
    spiritual: '#673ab7',
  },
};

export const ThemeContext: React.Context<ThemeContextType> = React.createContext(
  {
    theme: themes.theme5 as Theme,
    setTheme: (_: Theme) => {
      console.error('Set theme is not assigned');
    },
  },
);
