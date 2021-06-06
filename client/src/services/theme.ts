import AsyncStorage from '@react-native-community/async-storage';

const USER_THEME_KEY = 'user-theme';

/**
 * Saves selected theme key to local storage
 */
export function saveUserTheme(themeName: string) {
  // We only log errors since if the theme is not saved correctly it's
  // not a huge concern.
  AsyncStorage.setItem(USER_THEME_KEY, themeName, (err) => console.error(err));
}

/**
 * Loads selected theme key from local storage. Returns null if no theme is saved
 */
export async function getUserTheme(): Promise<string> {
  return AsyncStorage.getItem(USER_THEME_KEY);
}
