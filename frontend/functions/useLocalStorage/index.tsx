import { useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}

/*

Structure of local storage:

{
  auth: {
    email: string,
    authkey: string
  },
  prefs: {
    email: string,
    first_name: string,
    last_name: string,
    date_created: string,
    last_login: string,
    isClient: int, // 0 or 1
    isAdmin: int, // 0 or 1
    circle_colors: string,
    circle_rank: string,
    notify_time: int,
    avatar: string
  },
  avatar: {
    bg: null,
    torso: null,
    skintone: null,
    mood: null,
    hair: null,
  },
  survey: string[],
}

*/
