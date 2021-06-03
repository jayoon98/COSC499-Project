import { Colors } from './colors';
import { Themes } from './settings/Themes';
export type Domain = {
  name: string;
  color: string;
};

// Use to change color schemes and to get a human readable name for each domain.
// Default color theme is accent1

//TODO: when colours are updated in Themes.tsx, this is updated to match
// currently you can test other colour themes by manually changing code
// to accent1..accent4
export const domainColors = {
  ...Colors.accent5,
};
